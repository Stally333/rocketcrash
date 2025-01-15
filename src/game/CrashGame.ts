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
  private state: GameState = {
    phase: 'waiting',
    multiplier: 1.00,
    elapsed: 0,
    startTime: null,
    crashPoint: 1.00,
    hash: '',
    seed: '',
    previousGames: []
  }

  private readonly HOUSE_EDGE = 0.99 // 1% house edge
  private readonly GAME_UPDATE_RATE = 60 // Updates per second
  private updateInterval: number | null = null
  private lastUpdateTime: number = 0
  private callbacks: GameCallbacks = {}

  constructor() {
    this.generateNextCrashPoint()
  }

  public startGame() {
    if (this.state.phase !== 'waiting') return

    this.state.phase = 'starting'
    this.callbacks.onStarting?.()

    // 3 second countdown
    setTimeout(() => {
      this.state.phase = 'in-progress'
      this.state.startTime = Date.now()
      this.lastUpdateTime = this.state.startTime
      this.startGameLoop()
      this.callbacks.onGameStart?.()
    }, 3000)
  }

  private startGameLoop() {
    const updateGame = () => {
      const now = Date.now()
      const delta = now - this.lastUpdateTime
      this.lastUpdateTime = now

      if (this.state.startTime === null) return
      
      this.state.elapsed = (now - this.state.startTime) / 1000
      this.state.multiplier = this.calculateMultiplier(this.state.elapsed)

      // Check if crashed
      if (this.state.multiplier >= this.state.crashPoint) {
        this.crash()
        return
      }

      this.callbacks.onUpdate?.(this.state)
      this.updateInterval = requestAnimationFrame(updateGame)
    }

    this.updateInterval = requestAnimationFrame(updateGame)
  }

  private crash() {
    this.state.phase = 'crashed'
    this.state.multiplier = this.state.crashPoint
    
    if (this.updateInterval) {
      cancelAnimationFrame(this.updateInterval)
      this.updateInterval = null
    }

    this.callbacks.onCrash?.(this.state.crashPoint)
    this.addToGameHistory()
    this.generateNextCrashPoint()

    // Start new game after 2 seconds
    setTimeout(() => {
      this.state.phase = 'waiting'
      this.state.multiplier = 1.00
      this.state.elapsed = 0
      this.state.startTime = null
      this.callbacks.onUpdate?.(this.state)
    }, 2000)
  }

  private calculateMultiplier(elapsed: number): number {
    // Growth function: 1.0239^t
    return Math.pow(1.0239, elapsed * 100) * this.HOUSE_EDGE
  }

  private generateNextCrashPoint(): void {
    // For demo - in production this would use server-provided seed
    const serverSeed = Math.random().toString(36).substring(2)
    const clientSeed = Math.random().toString(36).substring(2)
    const hash = this.generateHash(`${serverSeed}-${clientSeed}`)
    
    // Use first 52 bits of hash for randomness
    const seed = parseInt(hash.slice(0, 13), 16)
    
    // Generate crash point between 1 and ~20
    const crashPoint = Math.max(1.00, (100 / (seed % 100 + 1)) * this.HOUSE_EDGE)
    
    this.state.crashPoint = crashPoint
    this.state.hash = hash
    this.state.seed = `${serverSeed}-${clientSeed}`
  }

  private generateHash(input: string): string {
    // Simple hash function for demo
    // In production use proper crypto
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
  }

  private addToGameHistory() {
    const gameResult = {
      crashPoint: this.state.crashPoint,
      hash: this.state.hash,
      seed: this.state.seed
    }
    
    this.state.previousGames = [gameResult, ...this.state.previousGames].slice(0, 50)
  }

  public setCallbacks(callbacks: GameCallbacks) {
    this.callbacks = callbacks
  }

  public getState(): GameState {
    return { ...this.state }
  }
}

interface GameState {
  phase: 'waiting' | 'starting' | 'in-progress' | 'crashed'
  multiplier: number
  elapsed: number
  startTime: number | null
  crashPoint: number
  hash: string
  seed: string
  previousGames: GameHistory[]
}

interface GameHistory {
  crashPoint: number
  hash: string
  seed: string
}

interface GameCallbacks {
  onUpdate?: (state: GameState) => void
  onCrash?: (crashPoint: number) => void
  onStarting?: () => void
  onGameStart?: () => void
} 