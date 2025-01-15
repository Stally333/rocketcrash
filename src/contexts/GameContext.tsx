'use client'

import React, { createContext, useContext, useRef, useState, useEffect } from 'react'
import { CrashGame } from '@/game/CrashGame'

interface GameContextType {
  phase: 'waiting' | 'starting' | 'in-progress' | 'crashed'
  multiplier: number
  hash: string
  previousGames: GameHistory[]
  startGame: () => void
  placeBet: (amount: number, autoCashout?: number) => void
  cashout: () => void
  bets: Bet[]
}

const GameContext = createContext<GameContextType | null>(null)

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState({
    phase: 'waiting',
    multiplier: 1.00,
    hash: '',
    previousGames: []
  })
  const [bets, setBets] = useState<Bet[]>([])
  const gameInstanceRef = useRef<CrashGame | null>(null)

  useEffect(() => {
    gameInstanceRef.current = new CrashGame()
    gameInstanceRef.current.setCallbacks({
      onUpdate: (state) => {
        setGameState({
          phase: state.phase,
          multiplier: state.multiplier,
          hash: state.hash,
          previousGames: state.previousGames
        })
      },
      onCrash: (crashPoint) => {
        // Handle crash
      }
    })

    return () => {
      // Cleanup
    }
  }, [])

  const placeBet = (amount: number, autoCashout?: number) => {
    if (gameState.phase !== 'waiting') return
    
    setBets(current => [...current, {
      id: Date.now(),
      username: 'You',
      amount,
      autoCashout,
      cashedOut: false
    }])

    // Start game if first bet
    if (bets.length === 0) {
      gameInstanceRef.current?.startGame()
    }
  }

  const cashout = () => {
    if (gameState.phase !== 'in-progress') return

    setBets(current =>
      current.map(bet => {
        if (bet.username === 'You' && !bet.cashedOut) {
          return {
            ...bet,
            cashedOut: true,
            profit: bet.amount * (gameState.multiplier - 1)
          }
        }
        return bet
      })
    )
  }

  return (
    <GameContext.Provider value={{
      ...gameState,
      startGame: () => gameInstanceRef.current?.startGame(),
      placeBet,
      cashout,
      bets
    }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within GameProvider')
  return context
}

interface Bet {
  id: number
  username: string
  amount: number
  autoCashout?: number
  cashedOut: boolean
  profit?: number
}

interface GameHistory {
  crashPoint: number
  hash: string
  seed: string
} 