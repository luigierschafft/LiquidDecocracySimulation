import Image from 'next/image'
import Link from 'next/link'

export default function PlayPage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-12">

      {/* ── Top area: title + Traditional button + Mongoose ── */}
      <div className="w-full max-w-xs relative mb-10">

        {/* Greeting text */}
        <div className="pr-16 pt-1">
          <p className="text-xl font-black text-gray-900 leading-snug">
            Hello, Thank you<br />
            for being here!<br />
            What would you<br />
            like to do today?
          </p>
        </div>

        {/* Mongoose – floats to the right, overlapping text */}
        <div className="absolute -right-2 top-8 pointer-events-none bg-transparent">
          <Image
            src="/mongoose.png"
            alt="Mongoose mascot"
            width={156}
            height={182}
            priority
            placeholder="empty"
            className="drop-shadow-lg bg-transparent"
            style={{ background: 'transparent' }}
          />
        </div>
      </div>

      {/* ── 3 main action buttons ── */}
      <div className="w-full max-w-xs flex flex-col gap-4">
        <Link href="/playful/topics" className="block">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] px-6 py-5 text-center text-xl font-bold text-gray-900 shadow-md active:scale-95 transition-transform">
            Choose a topic to<br />speak and sense
          </div>
        </Link>

        <Link href="/playful/help" className="block">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] px-6 py-5 text-center text-xl font-bold text-gray-900 shadow-md active:scale-95 transition-transform">
            I just want to help<br />where I can
          </div>
        </Link>

        <Link href="/playful/delegation" className="block">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] px-6 py-5 text-center text-xl font-bold text-gray-900 shadow-md active:scale-95 transition-transform">
            Organize my<br />delegation
          </div>
        </Link>
      </div>

    </div>
  )
}
