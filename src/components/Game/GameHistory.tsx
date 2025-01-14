import React from 'react'
import styles from './GameHistory.module.css'

const GameHistory = () => {
  const history = [
    { multiplier: 1.4, color: '#f64f59' },
    { multiplier: 1.09, color: '#f64f59' },
    { multiplier: 1.65, color: '#12c2e9' },
    { multiplier: 1.04, color: '#f64f59' },
    { multiplier: 1.16, color: '#c471ed' },
    { multiplier: 4.51, color: '#12c2e9' },
  ]

  return (
    <div className={styles.container}>
      {history.map((game, index) => (
        <div 
          key={index} 
          className={styles.gameResult}
          style={{ color: game.color }}
        >
          {game.multiplier.toFixed(2)}×
        </div>
      ))}
    </div>
  )
}

export default GameHistory 