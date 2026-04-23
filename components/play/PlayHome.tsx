'use client'

import Image from 'next/image'

export function PlayHome() {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      {/* Speech bubble */}
      <div className="relative bg-white border border-amber-200 shadow-md rounded-2xl rounded-bl-none px-5 py-4 max-w-sm w-full">
        <p className="text-sm font-semibold text-gray-800">
          Hi! Great that you&apos;re here! 👋
        </p>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          What would you like to talk about today? Pick a topic below or start a new one!
        </p>
        {/* Bubble tail */}
        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-b border-l border-amber-200 rotate-[-45deg]" />
      </div>

      {/* Mongoose image */}
      <Image
        src="/mongoose.png"
        alt="Mongoose mascot"
        width={110}
        height={130}
        className="drop-shadow-lg mt-1"
        priority
      />
    </div>
  )
}
