'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin') ?? false

  // Don't show header and footer on admin pages
  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
