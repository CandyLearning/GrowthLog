import type { Metadata } from 'next'
import './globals.css'
import { MSWProvider } from '@/components/MSWProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'

export const metadata: Metadata = {
  title: 'GrowthLog',
  description: '個人成長追蹤平台',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''
  return (
    <html lang="zh-TW">
      <body>
        <GoogleOAuthProvider clientId={googleClientId}>
          <MSWProvider>{children}</MSWProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
