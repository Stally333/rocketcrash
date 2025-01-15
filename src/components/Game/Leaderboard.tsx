'use client'

import React from 'react'
import styles from './Leaderboard.module.css'

const Leaderboard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Top Players</h3>
        <select className={styles.timeframe}>
          <option>24h</option>
          <option>7d</option>
          <option>30d</option>
        </select>
      </div>
      <div className={styles.playersList}>
        {/* Example players - replace with real data */}
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.playerRow}>
            <span className={styles.rank}>#{i}</span>
            <span className={styles.username}>Player {i}</span>
            <span className={styles.profit}>+₿ {(Math.random() * 1).toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard 