'use client'

import React from 'react'
import Link from 'next/link'
import styles from './Header.module.css'
import SoundController from '@/components/Game/SoundController'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logo}>
            <span>rocketcrash</span>
          </Link>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.label}>Players</span>
              <span className={styles.value}>1,234</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.label}>Total Wagered</span>
              <span className={styles.value}>₿ 123.45</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.label}>Max Profit</span>
              <span className={styles.value}>₿ 1.00</span>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link href="/bankroll" className={styles.navLink}>BANKROLL</Link>
          <Link href="/stats" className={styles.navLink}>STATS</Link>
          <Link href="/leaderboard" className={styles.navLink}>LEADERBOARD</Link>
          <Link href="/help" className={styles.navLink}>HELP</Link>
          <SoundController />
        </nav>
      </div>
    </header>
  )
}

export default Header 