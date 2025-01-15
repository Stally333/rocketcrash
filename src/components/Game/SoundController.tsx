'use client'

import React, { useState } from 'react'
import styles from './SoundController.module.css'

const SoundController = () => {
  const [muted, setMuted] = useState(false)
  
  return (
    <button 
      className={styles.button}
      onClick={() => setMuted(!muted)}
      aria-label={muted ? 'Unmute' : 'Mute'}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity={muted ? "0.5" : "1"}>
          <path
            d="M8 8H4V16H8L14 21V3L8 8Z"
            fill="currentColor"
          />
          {!muted && (
            <>
              <path
                d="M17.5 8C18.833 9.333 19.5 11 19.5 13C19.5 15 18.833 16.667 17.5 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M20.5 5C22.833 7.333 24 10 24 13C24 16 22.833 18.667 20.5 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}
        </g>
      </svg>
    </button>
  )
}

export default SoundController 