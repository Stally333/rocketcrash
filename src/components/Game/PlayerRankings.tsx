'use client'

import React from 'react'
import styles from './PlayerRankings.module.css'
import FairnessVerifier from './FairnessVerifier'

const PlayerRankings = () => {
  return (
    <div className={styles.playerRankings}>
      <div className={styles.header}>
        <h3>Top Players</h3>
        <select className={styles.timeframe}>
          <option>24h</option>
          <option>7d</option>
          <option>30d</option>
        </select>
      </div>
      <div className={styles.rankings}>
        {/* Top players list */}
      </div>
      <div className={styles.verifySection}>
        <FairnessVerifier />
      </div>
    </div>
  )
}

export default PlayerRankings 