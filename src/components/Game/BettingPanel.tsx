'use client'

import React, { useState } from 'react'
import styles from './BettingPanel.module.css'
import { useGame } from '@/contexts/GameContext'

const BettingPanel = () => {
  const { phase, multiplier, placeBet, cashout } = useGame()
  const [betAmount, setBetAmount] = useState('')
  const [autoCashout, setAutoCashout] = useState('')

  const handlePlaceBet = () => {
    if (!betAmount) return
    placeBet(Number(betAmount), autoCashout ? Number(autoCashout) : undefined)
  }

  const handleCashout = () => {
    cashout()
  }

  return (
    <div className={styles.container}>
      <div className={styles.betSection}>
        <div className={styles.betRow}>
          <div className={styles.betInput}>
            <label>BET AMOUNT</label>
            <input 
              type="number" 
              placeholder="0.00000000"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
            />
          </div>
          <div className={styles.betInput}>
            <label>AUTO CASHOUT</label>
            <input 
              type="number" 
              placeholder="0.00"
              value={autoCashout}
              onChange={(e) => setAutoCashout(e.target.value)}
            />
          </div>
        </div>
        
        {phase === 'waiting' ? (
          <button 
            className={styles.placeBetButton}
            onClick={handlePlaceBet}
          >
            PLACE BET
          </button>
        ) : phase === 'in-progress' ? (
          <button 
            className={`${styles.placeBetButton} ${styles.cashoutButton}`}
            onClick={handleCashout}
          >
            CASHOUT @ {multiplier.toFixed(2)}×
          </button>
        ) : null}
      </div>

      <div className={styles.fairnessSection}>
        <div className={styles.fairnessHeader}>
          <span>VERIFY FAIRNESS</span>
          <span className={styles.helpIcon}>?</span>
        </div>
        <div className={styles.fairnessInputs}>
          <div className={styles.fairnessInput}>
            <label>GAME HASH</label>
            <input type="text" value="8a7b6c5d4e3f2g1h" readOnly />
          </div>
          <div className={styles.fairnessInput}>
            <label>CLIENT SEED</label>
            <input type="text" placeholder="Enter your seed" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BettingPanel 