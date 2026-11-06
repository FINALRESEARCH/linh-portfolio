/*
 * Bare root so the site's global CSS (uppercase body, Tailwind preflight)
 * never reaches the embedded Studio. Site chrome lives in `(site)/layout.tsx`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
