'use client'

import React, { useState } from 'react'
import styles from './GameControls.module.css'
import { useGame } from '@/contexts/GameContext'

const GameControls = () => {
  const { phase, placeBet, cashout } = useGame()
  const [betAmount, setBetAmount] = useState('')
  const [autoCashout, setAutoCashout] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (phase === 'waiting') {
      const amount = parseFloat(betAmount)
      if (!amount || amount <= 0) return
      
      placeBet(
        amount,
        autoCashout ? parseFloat(autoCashout) : undefined
      )
      
      // Clear inputs after placing bet
      setBetAmount('')
      setAutoCashout('')
    } else if (phase === 'in-progress') {
      cashout()
    }
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.inputs}>
        <div className={styles.inputGroup}>
          <label>Bet Amount</label>
          <div className={styles.inputWrapper}>
            <input 
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className={styles.input}
              placeholder="0.00000000"
              step="0.00000001"
              min="0"
              disabled={phase !== 'waiting'}
            />
            <div className={styles.inputControls}>
              <button 
                type="button"
                className={styles.halfButton}
                onClick={() => setBetAmount(prev => (parseFloat(prev) / 2).toString())}
              >
                ½
              </button>
              <button 
                type="button"
                className={styles.doubleButton}
                onClick={() => setBetAmount(prev => (parseFloat(prev) * 2).toString())}
              >
                2×
              </button>
            </div>
            <span className={styles.currency}>bits</span>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Auto Cash Out</label>
          <div className={styles.inputWrapper}>
            <input 
              type="number"
              value={autoCashout}
              onChange={(e) => setAutoCashout(e.target.value)}
              className={styles.input}
              placeholder="0.00"
              step="0.01"
              min="1"
              disabled={phase !== 'waiting'}
            />
            <span className={styles.multiplier}>×</span>
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className={`${styles.betButton} ${
          phase === 'in-progress' ? styles.cashoutButton : ''
        }`}
        disabled={
          phase === 'crashed' || 
          phase === 'starting' || 
          (phase === 'waiting' && (!betAmount || parseFloat(betAmount) <= 0))
        }
      >
        {phase === 'waiting' ? 'Place Bet' : 
         phase === 'in-progress' ? `Cash Out (${gameState.multiplier.toFixed(2)}×)` :
         phase === 'starting' ? 'Starting...' : 'Crashed'}
      </button>
    </form>
  )
}

export default GameControls 