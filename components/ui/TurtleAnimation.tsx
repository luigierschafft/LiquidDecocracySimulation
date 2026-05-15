'use client'

import { useEffect, useRef } from 'react'
import Lottie from 'lottie-react'
import turtleData from '@/public/meditating-turtle.json'

interface Props {
  onComplete?: () => void
}

export function TurtleAnimation({ onComplete }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // 61 frames at 29fps ≈ 2.1s
    timerRef.current = setTimeout(() => {
      onComplete?.()
    }, 2200)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <Lottie
        animationData={turtleData}
        loop={false}
        style={{ width: 320, height: 320 }}
      />
    </div>
  )
}
