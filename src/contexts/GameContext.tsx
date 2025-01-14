'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { CrashGame } from '@/game/CrashGame'
import { GameState, GameContextType, GraphRef } from '@/types/game'

const GameContext = createContext<GameContextType | null>(null)

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const gameInstanceRef = useRef<CrashGame | null>(null)
  const graphRef = useRef<GraphRef | null>(null)
  const [gameState, setGameState] = useState<GameState>(() => {
    if (!gameInstanceRef.current) {
      gameInstanceRef.current = new CrashGame()
    }
    return gameInstanceRef.current.getState()
  })
  const [bets, setBets] = useState<Array<{
    id: number
    username: string
    amount: number
    autoCashout?: number
    cashedOut?: boolean
    profit?: number
  }>>([])

  useEffect(() => {
    const game = gameInstanceRef.current
    if (!game) return

    game.subscribe({
      onUpdate: (state) => {
        setGameState(state)
        
        // Handle auto-cashouts
        if (state.phase === 'in-progress') {
          bets.forEach(bet => {
            if (bet.autoCashout && !bet.cashedOut && state.multiplier >= bet.autoCashout) {
              setBets(current =>
                current.map(b => {
                  if (b.id === bet.id) {
                    return {
                      ...b,
                      cashedOut: true,
                      profit: b.amount * (state.multiplier - 1)
                    }
                  }
                  return b
                })
              )
            }
          })
        }
      },
      onCrash: (crashPoint) => {
        // Handle bets resolution
        setBets(currentBets => 
          currentBets.map(bet => {
            if (bet.cashedOut) return bet
            return {
              ...bet,
              cashedOut: false,
              profit: -bet.amount
            }
          })
        )
      },
      onStarting: () => {
        // Reset bets when new game starts
        setBets([])
      }
    })

    return () => {
      game.cleanup()
    }
  }, [bets]) // Add bets to dependency array

  const placeBet = (amount: number, autoCashout?: number) => {
    if (gameState.phase !== 'waiting') return
    
    // Add the bet
    setBets(current => [...current, {
      id: Date.now(),
      username: 'You',
      amount,
      autoCashout,
      cashedOut: false
    }])

    // Start the game if this is the first bet
    if (gameInstanceRef.current && bets.length === 0) {
      gameInstanceRef.current.startGame()
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
      phase: gameState.phase,
      multiplier: gameState.multiplier,
      hash: gameState.hash,
      previousGames: gameState.previousGames,
      startGame: () => {
        gameInstanceRef.current?.startGame()
        graphRef.current?.startGame()
      },
      placeBet,
      cashout,
      graphRef,
      bets
    }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within a GameProvider')
  return context
} 