'use client'

import React from 'react'
import styles from './PreviousRounds.module.css'
import { useGame } from '@/contexts/GameContext'

const PreviousRounds = () => {
  const { previousGames } = useGame()

  return (
    <div className={styles.container}>
      <div className={styles.rounds}>
        {previousGames.slice(0, 10).map((game, i) => (
          <div 
            key={i} 
            className={`${styles.round} ${game.crashPoint >= 2 ? styles.high : styles.low}`}
            title={`Hash: ${game.hash}`}
          >
            {game.crashPoint.toFixed(2)}×
          </div>
        ))}
      </div>
    </div>
  )
}

export default PreviousRounds