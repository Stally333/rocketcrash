'use client'

import React from 'react'
import styles from './ChatMessage.module.css'

export interface Message {
  id: number
  username: string
  text: string
  timestamp: string
  type?: 'system' | 'user'
  role?: 'admin' | 'mod' | 'vip' | 'user'
  color?: string
}

const ChatMessage = ({ message }: { message: Message }) => {
  const userColor = message.color || '#12c2e9'
  
  return (
    <div 
      className={`${styles.message} ${message.type === 'system' ? styles.system : ''}`}
      style={{ '--user-color': userColor } as React.CSSProperties}
    >
      <span className={styles.timestamp}>
        {message.timestamp}
      </span>
      <div className={styles.userInfo}>
        {message.role && (
          <span className={`${styles.badge} ${styles[message.role]}`}>
            {message.role.toUpperCase()}
          </span>
        )}
        <span className={styles.username}>{message.username}</span>
      </div>
      <span className={styles.text}>{message.text}</span>
    </div>
  )
}

export default ChatMessage 