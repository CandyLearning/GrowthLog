import type { Metadata } from 'next'
import './globals.css'
import { MSWProvider } from '@/components/MSWProvider'

export const metadata: Metadata = {
  title: 'GrowthLog',
  description: '個人成長追蹤平台',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  )
}
