export type GamePhase = 'waiting' | 'starting' | 'in-progress' | 'crashed'

export interface CrashPoint {
  value: number
  hash: string
  seed: string
}

export interface GameState {
  phase: GamePhase
  multiplier: number
  crashPoint: number
  startTime: number | null
  elapsed: number
  hash: string
  seed: string
  previousGames: GameHistory[]
}

export interface GameHistory {
  crashPoint: number
  hash: string
  seed: string
}

export interface Bet {
  id: number
  username: string
  amount: number
  autoCashout?: number
  cashedOut: boolean
  profit?: number
}

export interface GraphRef {
  startGame: () => void
}

export interface GameContextType {
  phase: GamePhase
  multiplier: number
  hash: string
  previousGames: GameHistory[]
  startGame: () => void
  placeBet: (amount: number, autoCashout?: number) => void
  cashout: () => void
  bets: Bet[]
  graphRef: React.MutableRefObject<GraphRef | null>
} 