'use client'

import React, { useState, useEffect } from 'react'
import styles from './FairnessVerifier.module.css'

const FairnessVerifier = () => {
  const [hash, setHash] = useState('')
  const [seed, setSeed] = useState('')
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup code if needed
    }
  }, [])

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    // Verification logic
  }
  
  return (
    <div className={styles.fairnessVerifier}>
      <h3>Verify Fairness</h3>
      <form className={styles.inputs} onSubmit={handleVerify}>
        <input 
          type="text"
          placeholder="Game Hash"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
        />
        <input 
          type="text"
          placeholder="Server Seed"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  )
}

export default FairnessVerifier 