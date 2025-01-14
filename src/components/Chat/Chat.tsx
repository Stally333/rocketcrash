'use client'

import React, { useEffect, useRef, useState } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import styles from './Chat.module.css'
import ChatMessage, { Message } from './ChatMessage'

const MOCK_USERS = {
  'System': { role: 'system', color: '#888' },
  'GodzillaVsKong': { role: 'user', color: '#00ff99' },
}

const formatTime = () => {
  return new Date().toLocaleTimeString([], { 
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
  }).toUpperCase()
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      username: 'System',
      text: 'Welcome to RocketCrash chat!',
      timestamp: formatTime(),
      type: 'system',
      ...MOCK_USERS['System']
    },
    {
      id: 2,
      username: 'GodzillaVsKong',
      text: 'Good luck everyone! 🎰',
      timestamp: formatTime(),
      ...MOCK_USERS['GodzillaVsKong']
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now(),
      username: 'You',
      text: newMessage.trim(),
      timestamp: formatTime(),
      role: 'user',
      color: '#12c2e9'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    setShowEmoji(false)
  }

  const addEmoji = (emoji: any) => {
    setNewMessage(prev => prev + emoji.native)
    chatInputRef.current?.focus()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>CHAT</span>
        <div className={styles.controls}>
          <button className={styles.channelButton}>
            <img src="/en.png" alt="English" className={styles.flag} />
            EN
          </button>
          <button className={styles.leaveButton}>Leave</button>
        </div>
      </div>

      <div className={styles.messages}>
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputArea}>
        {showEmoji && (
          <div className={styles.emojiPicker}>
            <Picker 
              data={data} 
              onEmojiSelect={addEmoji}
              theme="dark"
              skinTonePosition="none"
            />
          </div>
        )}
        <div className={styles.inputWrapper}>
          <button 
            type="button"
            className={styles.emojiButton}
            onClick={() => setShowEmoji(!showEmoji)}
          >
            😊
          </button>
          <input
            ref={chatInputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="You must be logged in to chat"
            className={styles.input}
            maxLength={100}
          />
          <div className={styles.charCount}>
            {newMessage.length}/100
          </div>
        </div>
      </form>
    </div>
  )
}

export default Chat 