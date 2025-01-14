import React from 'react'
import styles from './page.module.css'
import Graph from '@/components/Game/Graph'
import GameStatus from '@/components/Game/GameStatus'
import GameControls from '@/components/Game/GameControls'
import LiveBets from '@/components/Game/LiveBets'
import Chat from '@/components/Chat/Chat'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.gameContainer}>
        <section className={styles.gameSection}>
          <div className={styles.gameArea}>
            <div className={styles.gameGraph}>
              <div className={styles.graph}>
                <Graph />
              </div>
            </div>
          </div>
          <div className={styles.chatSection}>
            <Chat />
          </div>
        </section>
        
        <section className={styles.sidebar}>
          <div className={styles.controls}>
            <GameControls />
          </div>
          <div className={styles.betsSection}>
            <LiveBets />
          </div>
        </section>
      </div>
    </main>
  )
} 