import Image from 'next/image'

/**
 * The mongoose companion. One component, four poses, three fixed sizes —
 * so the mascot is never bigger than its role on the page.
 *
 *   sm  56px  — beside a heading on content pages (topic list, discussion)
 *   md  88px  — in a page header or next to an empty / done state
 *   lg 132px  — only on the playful home greeting
 *
 * The mascot always sits in the layout flow; it never floats over buttons.
 */
const POSES = {
  wave: { src: '/mongoose.png', ratio: 500 / 500 },
  handstand: { src: '/mongoose-handstand.png', ratio: 416 / 599 },
  ball: { src: '/mongoose-ball.png', ratio: 405 / 616 },
  thinking: { src: '/mongoose-thinking.png', ratio: 403 / 620 },
} as const

const HEIGHTS = { sm: 56, md: 88, lg: 132 } as const

export type MascotPose = keyof typeof POSES
export type MascotSize = keyof typeof HEIGHTS

export function Mascot({
  pose = 'wave',
  size = 'md',
  className = '',
  priority = false,
}: {
  pose?: MascotPose
  size?: MascotSize
  className?: string
  priority?: boolean
}) {
  const { src, ratio } = POSES[pose]
  // the "wave" image has generous empty margins, so give it a little more room
  const h = pose === 'wave' ? Math.round(HEIGHTS[size] * 1.25) : HEIGHTS[size]
  const w = Math.round(h * ratio)
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={w}
      height={h}
      priority={priority}
      className={`pointer-events-none select-none shrink-0 drop-shadow-[0_4px_6px_rgba(60,40,10,0.15)] ${className}`}
      style={{ width: w, height: h }}
    />
  )
}
