'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './Chat.module.css'
import { FiSend, FiUsers, FiSettings } from 'react-icons/fi'

interface ChatMessage {
  id: string
  username: string
  content: string
  timestamp: Date
  type?: 'system' | 'user' | 'win' | 'crash'
  role?: 'admin' | 'mod' | 'vip'
  bet?: number
  multiplier?: number
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    type: 'system',
    username: 'System',
    content: 'Welcome to the chat! Please be respectful to other users.',
    timestamp: new Date(Date.now() - 360000)
  },
  {
    id: '2',
    username: 'Alex',
    content: 'Hey everyone! Good luck with your bets 🍀',
    timestamp: new Date(Date.now() - 240000),
    type: 'user',
    role: 'vip'
  },
  {
    id: '3',
    username: 'Sarah',
    content: 'Just won 2x! 🎉',
    timestamp: new Date(Date.now() - 180000),
    type: 'win',
    bet: 100,
    multiplier: 2.00
  },
  {
    id: '4',
    type: 'crash',
    username: 'System',
    content: 'Crashed @ 1.89x!',
    timestamp: new Date(Date.now() - 120000)
  },
  {
    id: '5',
    username: 'Mike',
    content: 'Nice win Sarah! What was your strategy?',
    timestamp: new Date(Date.now() - 60000),
    type: 'user',
    role: 'mod'
  }
]

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [onlineUsers] = useState(1234)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'User',
      content: inputMessage,
      timestamp: new Date(),
      type: 'user'
    }

    setMessages(prev => {
      const updatedMessages = [...prev, newMessage]
      if (updatedMessages.length > 50) {
        return updatedMessages.slice(-50)
      }
      return updatedMessages
    })
    setInputMessage('')
    setIsTyping(false)
  }

  const renderMessage = (message: ChatMessage) => {
    switch (message.type) {
      case 'system':
        return <div key={message.id} className={styles.systemMessage}>{message.content}</div>
      case 'win':
        return (
          <div key={message.id} className={`${styles.message} ${styles.winMessage}`}>
            <span className={styles.username}>{message.username}</span>
            <span className={styles.timestamp}>{message.timestamp.toLocaleTimeString()}</span>
            <div className={styles.content}>
              {message.content}
              <span className={styles.betInfo}>
                Won {message.bet} bits @ {message.multiplier}x
              </span>
            </div>
          </div>
        )
      case 'crash':
        return (
          <div key={message.id} className={`${styles.message} ${styles.crashMessage}`}>
            <div className={styles.content}>{message.content}</div>
          </div>
        )
      default:
        return (
          <div key={message.id} className={styles.message}>
            {message.role && (
              <span className={`${styles.badge} ${styles[message.role]}`}>
                {message.role.toUpperCase()}
              </span>
            )}
            <span className={styles.username}>{message.username}</span>
            <span className={styles.timestamp}>
              {message.timestamp.toLocaleTimeString()}
            </span>
            <div className={styles.content}>{message.content}</div>
          </div>
        )
    }
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3>CHAT</h3>
          <div className={styles.onlineUsers}>
            <FiUsers />
            <span>{onlineUsers}</span>
          </div>
        </div>
        <button className={styles.settingsButton}>
          <FiSettings />
        </button>
      </div>

      <div className={styles.messageArea}>
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputArea}>
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => {
            setInputMessage(e.target.value)
            setIsTyping(e.target.value.length > 0)
          }}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
          placeholder="Type a message..."
          className={styles.input}
          maxLength={500}
        />
        <button 
          type="submit" 
          className={styles.sendButton}
          disabled={!isTyping}
        >
          <FiSend />
        </button>
      </form>
    </div>
  )
} 