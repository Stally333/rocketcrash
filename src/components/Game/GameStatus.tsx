'use client'

import React, { useEffect, useState } from 'react'
import styles from './GameStatus.module.css'
import { useGame } from '@/contexts/GameContext'

const GameStatus = () => {
  const { phase, multiplier } = useGame()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (phase === 'starting') {
      setCountdown(3)
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [phase])

  return (
    <div className={`${styles.container} ${styles[phase]}`}>
      {phase === 'waiting' && (
        <div className={styles.waiting}>
          Place your bets
        </div>
      )}
      {phase === 'starting' && (
        <div className={styles.countdown}>
          Starting in {countdown}s...
        </div>
      )}
      {phase === 'crashed' && (
        <div className={styles.crashedAt}>
          CRASHED AT {multiplier.toFixed(2)}×
        </div>
      )}
    </div>
  )
}

export default GameStatus 