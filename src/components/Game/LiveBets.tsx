'use client'

import React from 'react'
import styles from './LiveBets.module.css'

interface Bet {
  id: number
  username: string
  amount: number
  cashout: number | null
  profit: number | null
}

const LiveBets = () => {
  const [bets, setBets] = React.useState<Bet[]>([
    { id: 1, username: 'JaimeLannister', amount: 2000, cashout: null, profit: null },
    { id: 2, username: 'Helloblue', amount: 969, cashout: 1.5, profit: 484.5 },
    { id: 3, username: '1891', amount: 150, cashout: null, profit: null },
    { id: 4, username: 'BIObits', amount: 100, cashout: 2.1, profit: 110 },
  ])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>USER</span>
        <span>@</span>
        <span>BET</span>
        <span>PROFIT</span>
      </div>
      <div className={styles.betsList}>
        {bets.map(bet => (
          <div key={bet.id} className={styles.betItem}>
            <span className={styles.username}>{bet.username}</span>
            <span className={styles.cashout}>
              {bet.cashout ? `${bet.cashout.toFixed(2)}×` : '-'}
            </span>
            <span className={styles.amount}>{bet.amount.toLocaleString()}</span>
            <span className={styles.profit}>
              {bet.profit ? `+${bet.profit.toLocaleString()}` : '-'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LiveBets 