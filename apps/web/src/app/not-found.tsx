import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="fine-print">Page not found.</p>
      <Link href="/">Back home</Link>
    </div>
  )
}
