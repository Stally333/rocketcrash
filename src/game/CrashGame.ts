import { GamePhase, GameState, CrashPoint } from '@/types/game'

const simpleHash = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16)
}

export class CrashGame {
  private state: GameState
  private readonly HOUSE_EDGE = 0.99 // 1% house edge
  private readonly GAME_UPDATE_RATE = 60 // Updates per second
  private updateInterval: number | null = null
  private lastUpdateTime: number = 0

  private callbacks: {
    onUpdate?: (state: GameState) => void
    onCrash?: (crashPoint: number) => void
    onStarting?: () => void
    onGameStart?: () => void
  } = {}

  // Add proper timeout handling
  private startTimeout: number | null = null
  private crashTimeout: number | null = null
  private animationFrame: number | null = null

  constructor() {
    this.state = this.getInitialState()
    this.generateNextCrashPoint()
  }

  private getInitialState(): GameState {
    return {
      phase: 'waiting',
      multiplier: 1.00,
      crashPoint: 1.00,
      startTime: null,
      elapsed: 0,
      hash: '',
      seed: '',
      previousGames: []
    }
  }

  // Provably fair crash point generation
  private generateNextCrashPoint(): CrashPoint {
    // For demo purposes - in production this would come from server
    const serverSeed = Math.random().toString(36).substring(2)
    const clientSeed = Math.random().toString(36).substring(2)
    const combinedSeed = `${serverSeed}-${clientSeed}`
    const hash = simpleHash(combinedSeed)
    
    // Use the first 8 characters of hash for randomness
    const seedInt = parseInt(hash.slice(0, 8), 16)
    const max = 0xffffffff // 32-bit max
    
    // Generate crash point between 1 and 10 for demo
    const rawPoint = (seedInt % 900) / 100 + 1 // 1.00 to 10.00
    const crashPoint = Math.max(1.00, rawPoint * this.HOUSE_EDGE)

    return {
      value: crashPoint,
      hash: hash,
      seed: combinedSeed
    }
  }

  private calculateMultiplier(elapsed: number): number {
    // Exponential growth function
    // 1.0696^t where t is seconds elapsed
    return Math.pow(1.0696, elapsed / 1000)
  }

  private update = () => {
    if (this.state.phase !== 'in-progress' || !this.state.startTime) return

    const now = Date.now()
    const deltaTime = now - this.lastUpdateTime
    this.lastUpdateTime = now

    // Ensure we're not updating too frequently
    if (deltaTime < 1000 / this.GAME_UPDATE_RATE) {
      this.animationFrame = requestAnimationFrame(this.update)
      return
    }

    this.state.elapsed = now - this.state.startTime
    this.state.multiplier = this.calculateMultiplier(this.state.elapsed)

    // Check for crash
    if (this.state.multiplier >= this.state.crashPoint) {
      this.crash()
      return
    }

    this.callbacks.onUpdate?.(this.state)
    this.animationFrame = requestAnimationFrame(this.update)
  }

  public startGame() {
    if (this.state.phase !== 'waiting') return

    // Generate next crash point before starting
    const nextCrash = this.generateNextCrashPoint()
    this.state.crashPoint = nextCrash.value
    this.state.hash = nextCrash.hash
    this.state.seed = nextCrash.seed

    this.state.phase = 'starting'
    this.callbacks.onStarting?.()
    this.callbacks.onUpdate?.(this.state)

    // Start the game after a short delay
    this.startTimeout = window.setTimeout(() => {
      this.state.phase = 'in-progress'
      this.state.startTime = Date.now()
      this.lastUpdateTime = Date.now()
      this.callbacks.onGameStart?.()
      this.callbacks.onUpdate?.(this.state)
      
      // Start the game loop
      this.update()
    }, 3000) // 3 second countdown
  }

  private crash() {
    // Stop updates
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }

    this.state.phase = 'crashed'
    this.callbacks.onCrash?.(this.state.crashPoint)
    
    // Store game history
    this.state.previousGames.unshift({
      crashPoint: this.state.crashPoint,
      hash: this.state.hash,
      seed: this.state.seed
    })
    
    // Keep last 50 games
    if (this.state.previousGames.length > 50) {
      this.state.previousGames.pop()
    }

    // Reset for next round after delay
    this.crashTimeout = window.setTimeout(() => {
      this.state = {
        ...this.getInitialState(),
        previousGames: this.state.previousGames
      }
      this.callbacks.onUpdate?.(this.state)
    }, 2000)
  }

  public verifyGameResult(hash: string, seed: string): number {
    const verificationHash = simpleHash(seed)
    if (verificationHash !== hash) {
      throw new Error('Invalid game result')
    }
    
    const seedInt = parseInt(hash.slice(0, 8), 16)
    const max = 0xffffffff
    const rawPoint = (seedInt % 900) / 100 + 1
    return Math.max(1.00, rawPoint * this.HOUSE_EDGE)
  }

  public getGameStats() {
    const games = this.state.previousGames
    return {
      totalGames: games.length,
      averageMultiplier: games.reduce((acc, game) => acc + game.crashPoint, 0) / games.length,
      maxMultiplier: Math.max(...games.map(game => game.crashPoint)),
      minMultiplier: Math.min(...games.map(game => game.crashPoint)),
      below2x: games.filter(game => game.crashPoint < 2).length,
      above10x: games.filter(game => game.crashPoint > 10).length
    }
  }

  public subscribe(callbacks: {
    onUpdate?: (state: GameState) => void
    onCrash?: (crashPoint: number) => void
    onStarting?: () => void
    onGameStart?: () => void
  }) {
    this.callbacks = callbacks
  }

  public getState(): GameState {
    return { ...this.state }
  }

  public cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
    
    // Cancel any pending animations
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }

    // Clear any pending timeouts
    if (this.startTimeout) {
      clearTimeout(this.startTimeout)
      this.startTimeout = null
    }

    if (this.crashTimeout) {
      clearTimeout(this.crashTimeout)
      this.crashTimeout = null
    }

    // Reset state
    this.state = this.getInitialState()
    this.callbacks = {}
  }
} 