'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGoogleLogin } from '@react-oauth/google'
import { googleOAuthCallback } from '@/lib/api/auth'
import { setAuthToken } from '@/lib/auth'
import styles from './page.module.css'

const isMock = process.env.NEXT_PUBLIC_MOCK_API === 'true'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const profile = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((r) => r.json())

        const res = await googleOAuthCallback({
          google_id: profile.sub,
          display_name: profile.name,
          avatar_url: profile.picture ?? null,
        })
        setAuthToken(res.token)
        router.replace('/goals')
      } catch {
        setError('登入失敗，請重試')
        setLoading(false)
      }
    },
    onError: () => {
      setError('Google 登入取消或失敗')
      setLoading(false)
    },
  })

  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)
    if (isMock) {
      try {
        const res = await googleOAuthCallback({
          google_id: 'dev-google-uid-001',
          display_name: '小明',
          avatar_url: 'https://lh3.google.com/photo1',
        })
        setAuthToken(res.token)
        router.replace('/goals')
      } catch {
        setError('登入失敗，請重試')
        setLoading(false)
      }
    } else {
      googleLogin()
    }
  }

  return (
    <div className={styles.bg}>
      <div className={styles.card}>
        <div className={styles.logo}>🌸</div>
        <h1 className={styles.title}>GrowthLog</h1>
        <p className={styles.subtitle}>
          記錄成長的每一天<br />
          小小的進步，都值得被看見 ✨
        </p>

        <button
          className={styles.googleBtn}
          onClick={handleGoogleLogin}
          disabled={loading}
          data-testid="google-login-btn"
        >
          <div className={styles.googleIcon} />
          {loading ? '登入中…' : '使用 Google 帳號登入'}
        </button>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.footer}>登入即表示同意服務條款與隱私政策</p>
      </div>
    </div>
  )
}
