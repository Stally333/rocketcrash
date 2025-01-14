import React from 'react'
import Link from 'next/link'
import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <svg 
            className={styles.rocket} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12.5 2C9 2 4 6.5 4 10.5C4 13.5 6 16 8 17.5C9 18.5 10 22 10 22H11.5C11.5 22 11 19 12.5 17.5C14 19 13.5 22 13.5 22H15C15 22 16 18.5 17 17.5C19 16 21 13.5 21 10.5C21 6.5 16 2 12.5 2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.logoText}>rocketcrash</span>
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/bankroll" className={styles.navLink}>
            BANKROLL
          </Link>
          <Link href="/stats" className={styles.navLink}>
            STATS
          </Link>
          <Link href="/leaderboard" className={styles.navLink}>
            LEADERBOARD
          </Link>
          <Link href="/help" className={styles.navLink}>
            HELP
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header 