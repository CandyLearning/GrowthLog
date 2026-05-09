'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { googleOAuthCallback } from '@/lib/api/auth'
import { setAuthToken } from '@/lib/auth'
import styles from './page.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)
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
