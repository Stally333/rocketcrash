'use client'

import React from 'react'
import styles from './RocketAnimation.module.css'
import { useGame } from '@/contexts/GameContext'

const RocketAnimation = () => {
  const { phase, multiplier } = useGame()
  
  return (
    <div className={`${styles.container} ${styles[phase]}`}>
      <div 
        className={styles.rocket}
        style={{
          transform: `translate(${multiplier * 10}px, ${-multiplier * 20}px) rotate(${multiplier * 15}deg)`
        }}
      >
        🚀
      </div>
      <div className={styles.flames}>
        {/* Animated flame particles */}
      </div>
    </div>
  )
}

export default RocketAnimation 