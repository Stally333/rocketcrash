'use client'

import React from 'react'
import styles from './BettingPanel.module.css'

const BettingPanel = () => {
  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <label>Bet Amount</label>
        <div className={styles.inputWrapper}>
          <input 
            type="number" 
            placeholder="0.00000000"
            className={styles.input}
          />
          <span className={styles.currency}>bits</span>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label>Auto Cash Out</label>
        <div className={styles.inputWrapper}>
          <input 
            type="number" 
            placeholder="0.00"
            className={styles.input}
          />
          <span className={styles.multiplier}>×</span>
        </div>
      </div>

      <button className={styles.betButton}>
        Place Bet
      </button>
    </div>
  )
}

export default BettingPanel 