'use client'

import React from 'react'
import styles from './GameStats.module.css'

const GameStats = () => {
  return (
    <div className={styles.stat}>
      <div className={styles.label}>Players</div>
      <div className={styles.value}>1,234</div>
      <div className={styles.label}>Total Wagered</div>
      <div className={styles.value}>₿ 123.45</div>
      <div className={styles.label}>Max Profit</div>
      <div className={styles.value}>₿ 1.00</div>
    </div>
  )
}

export default GameStats 