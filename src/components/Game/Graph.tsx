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

  useEffect(() => {
    const startGameFn = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      startTime.current = Date.now()
      points.current = []
      animate()
    }

    const graphInstance: GraphRef = {
      startGame: startGameFn
    }

    graphRef.current = graphInstance

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (graphRef.current === graphInstance) {
        graphRef.current = null
      }
    }
  }, [graphRef])

  const calculateY = (multiplier: number, height: number) => {
    // Scale the y position logarithmically
    return height - (height * (multiplier - 1) / 1.5)
  }
  
  const drawGraph = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)
    
    // Draw Y-axis markers and grid
    const yMarkers = [1.2, 1.4, 1.6, 1.8, 2.0]
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = '12px JetBrains Mono'
    
    yMarkers.forEach(marker => {
      const y = calculateY(marker, height)
      ctx.fillText(`${marker.toFixed(1)}×`, 5, y)
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.beginPath()
      ctx.moveTo(40, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    })
    
    // Draw crash line
    if (points.current.length > 1) {
      ctx.beginPath()
      ctx.moveTo(40, height - 40)
      
      // Line color based on game state
      ctx.strokeStyle = phase === 'crashed' ? '#f64f59' : '#12c2e9'
      ctx.lineWidth = 2
      
      points.current.forEach((point, i) => {
        if (i > 0) {
          ctx.lineTo(point.x + 40, point.y)
        }
      })
      ctx.stroke()
    }
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas || !startTime.current) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const elapsed = Date.now() - startTime.current
    const newMultiplier = 1 + (elapsed / 2000)
    
    const width = canvas.width
    const height = canvas.height
    
    // Add new point
    const x = points.current.length * 3
    const y = calculateY(newMultiplier, height)
    points.current.push({ x, y })
    
    setMultiplier(newMultiplier)
    drawGraph(ctx, width, height)
    
    // Random crash check with better odds
    if (newMultiplier > 1.1) {
      const crashChance = Math.min((newMultiplier - 1.1) / 10, 0.05)
      if (Math.random() < crashChance) {
        crash()
        return
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.scale(dpr, dpr)
    drawGraph(ctx, canvas.width, canvas.height)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

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