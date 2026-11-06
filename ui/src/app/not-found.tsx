import './globals.css'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-start justify-center gap-4 pt-3 pr-2.5 pb-2.5 pl-2.5">
      <p className="text-[0.7rem] leading-[0.9rem] tracking-[-0.005rem] mobile:text-[0.6rem] mobile:leading-[0.7rem]">
        Page not found.
      </p>
      <Link href="/">Back home</Link>
    </div>
  )
}
