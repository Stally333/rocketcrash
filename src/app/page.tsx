'use client'

import React from 'react'
import styles from './page.module.css'
import CrashGraph from '@/components/Game/CrashGraph'
import PreviousRounds from '@/components/Game/PreviousRounds'
import Chat from '@/components/Chat/Chat'
import Leaderboard from '@/components/Game/Leaderboard'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.gameSection}>
        <div className={styles.gameArea}>
          <div className={styles.topBar}>
            <PreviousRounds />
          </div>
          
          <div className={styles.gameWrapper}>
            <div className={styles.gameContainer}>
              <CrashGraph />
            </div>
            <div className={styles.bettingContainer}>
              <div className={styles.betInputs}>
                <div className={styles.betInput}>
                  <label>BET AMOUNT</label>
                  <input type="number" placeholder="0.00000000" />
                </div>
                <div className={styles.betInput}>
                  <label>AUTO CASHOUT</label>
                  <input type="number" placeholder="0.00" />
                </div>
              </div>
              <button className={styles.placeBetButton}>
                PLACE BET
              </button>

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
          </div>
        </div>

        <div className={styles.bottomSection}>
          <Leaderboard />
          <div className={styles.chatSection}>
            <Chat />
          </div>
        </div>
      </div>
    </main>
  )
} 