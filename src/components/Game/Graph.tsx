'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from './Graph.module.css'
import { useGame } from '@/contexts/GameContext'
import { GamePhase, GraphRef } from '@/types/game'

interface Point {
  x: number
  y: number
}

const Graph = () => {
  const { phase, multiplier, setMultiplier, crash, graphRef } = useGame()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const points = useRef<Point[]>([])
  const startTime = useRef<number | null>(null)

  // ... rest of the graph implementation

  return (
    <div className={styles.viewport}>
      <div className={styles.gridLines} />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={`${styles.gameStatus} ${styles[phase]}`}>
        {multiplier.toFixed(2)}×
      </div>
      <div className={styles.infoBar}>
        <div className={styles.fairnessHash}>
          Hash: 8a7b6c5d4e3f2g1h
        </div>
        <div className={styles.markers}>
          <div className={styles.timeMarker}>00:05</div>
          <div className={styles.multiplierMarker}>{multiplier.toFixed(2)}×</div>
        </div>
      </div>
    </div>
  )
}

export default Graph 