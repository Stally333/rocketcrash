'use client'

import React, { useEffect, useRef } from 'react'
import { useGame } from '@/contexts/GameContext'
import styles from './CrashGraph.module.css'

interface Point {
  x: number
  y: number
}

const CrashGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { phase, multiplier } = useGame()
  const pointsRef = useRef<Point[]>([])
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number | null>(null)

  const initCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size with device pixel ratio
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    return ctx
  }

  const drawGraph = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current
    if (!canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw crash line
    ctx.beginPath()
    ctx.strokeStyle = '#12c2e9'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    pointsRef.current.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })

    ctx.stroke()

    // Add glow effect
    ctx.save()
    ctx.filter = 'blur(4px)'
    ctx.strokeStyle = 'rgba(18, 194, 233, 0.4)'
    ctx.lineWidth = 4
    ctx.stroke()
    ctx.restore()
  }

  const calculatePoint = (elapsed: number): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    // Convert time to x coordinate (0-100% of width)
    const x = (elapsed / 10) * canvas.width
    
    // Calculate y using exponential growth function
    const multiplier = Math.pow(1.0239, elapsed * 100)
    const y = canvas.height - (multiplier * 50)

    return { x, y }
  }

  const animate = (timestamp: number) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    if (!startTimeRef.current) {
      startTimeRef.current = timestamp
    }

    const elapsed = (timestamp - startTimeRef.current) / 1000
    const newPoint = calculatePoint(elapsed)
    pointsRef.current.push(newPoint)

    drawGraph(ctx)

    if (phase === 'in-progress') {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  const handleCrash = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // Add crash effect
    ctx.save()
    ctx.strokeStyle = '#f64f59'
    ctx.filter = 'blur(8px)'
    ctx.lineWidth = 6
    ctx.stroke()
    ctx.restore()

    // Shake effect
    const canvas = canvasRef.current
    if (canvas) {
      canvas.style.transform = 'translate(2px, 2px)'
      setTimeout(() => {
        canvas.style.transform = 'translate(-2px, -2px)'
        setTimeout(() => {
          canvas.style.transform = 'none'
        }, 50)
      }, 50)
    }
  }

  useEffect(() => {
    const ctx = initCanvas()
    if (!ctx) return

    if (phase === 'in-progress') {
      pointsRef.current = []
      startTimeRef.current = null
      animationRef.current = requestAnimationFrame(animate)
    } else if (phase === 'crashed') {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      handleCrash()
    } else if (phase === 'waiting') {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      pointsRef.current = []
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [phase])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const ctx = initCanvas()
      if (ctx && pointsRef.current.length > 0) {
        drawGraph(ctx)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={styles.graphContainer}>
      <div className={styles.gridLines} />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.multiplier}>
        {multiplier.toFixed(2)}×
      </div>
    </div>
  )
}

export default CrashGraph 