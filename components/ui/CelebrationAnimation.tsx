'use client'

import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'
import celebrationData from '@/public/celebration.json'

type Size = 'small' | 'medium' | 'large'

interface Props {
  size?: Size
  onComplete?: () => void
}

const SIZE_CONFIG: Record<Size, { px: number; frames: number; className: string }> = {
  small:  { px: 160, frames: 45,  className: 'fixed bottom-8 right-8 z-50 pointer-events-none' },
  medium: { px: 320, frames: 120, className: 'fixed inset-0 z-50 pointer-events-none flex items-center justify-center' },
  large:  { px: 500, frames: 300, className: 'fixed inset-0 z-50 pointer-events-none flex items-center justify-center' },
}

export function CelebrationAnimation({ size = 'medium', onComplete }: Props) {
  const [visible, setVisible] = useState(true)
  const config = SIZE_CONFIG[size]

  useEffect(() => {
    const ms = (config.frames / 30) * 1000
    const t = setTimeout(() => {
      setVisible(false)
      onComplete?.()
    }, ms)
    return () => clearTimeout(t)
  }, [config.frames, onComplete])

  if (!visible) return null

  return (
    <div className={config.className}>
      <Lottie
        animationData={celebrationData}
        loop={false}
        autoplay
        style={{ width: config.px, height: config.px }}
      />
    </div>
  )
}
