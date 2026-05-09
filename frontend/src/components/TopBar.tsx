'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { getMyProfile, updateMyProfile } from '@/lib/api/auth'
import { clearAuthToken } from '@/lib/auth'
import type { UserProfile } from '@/lib/types/auth.schema'
import { Modal } from '@/components/ui/Modal'
import { Toast } from '@/components/Toast'
import styles from './TopBar.module.css'

const PATH_TITLES: Record<string, [string, string]> = {
  '/goals':     ['學習目標',   '管理你的成長計畫 🌱'],
  '/moods':     ['心情紀錄',   '追蹤你的情緒變化 ☁️'],
  '/gratitude': ['感謝日記',   '記下生活中值得感謝的事 ✨'],
  '/pet':       ['電子寵物',   '你的成長夥伴 🐾'],
}

export function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const dropRef = useRef<HTMLDivElement>(null)

  const [user, setUser] = useState<UserProfile | null>(null)
  const [dropOpen, setDropOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  // Determine title from pathname
  const titleEntry = Object.entries(PATH_TITLES).find(([k]) => pathname.startsWith(k))
  const [title, subtitle] = titleEntry ? titleEntry[1] : ['GrowthLog', '']

  useEffect(() => {
    getMyProfile().then(setUser).catch(() => {})
  }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) return
    try {
      await updateMyProfile({ display_name: displayName.trim() })
      setUser((u) => u ? { ...u, display_name: displayName.trim() } : u)
      setEditOpen(false)
      setToast('個人資料已更新 ✓')
    } catch {
      setToast('更新失敗，請重試')
    }
  }

  function handleLogout() {
    clearAuthToken()
    router.replace('/login')
  }

  const initials = user?.display_name?.charAt(0) ?? '?'

  return (
    <>
      <header className={styles.topbar} data-testid="topbar">
        <div className={styles.title}>
          {title}
          {subtitle && <small className={styles.subtitle}>{subtitle}</small>}
        </div>

        <div ref={dropRef} className={styles.userArea}>
          <button
            className={styles.userBtn}
            onClick={() => setDropOpen(!dropOpen)}
            data-testid="topbar-user"
          >
            <div className={styles.avatar}>{initials}</div>
            <span className={styles.userName}>{user?.display_name ?? '…'}</span>
            <span className={styles.chevron}>{dropOpen ? '▲' : '▾'}</span>
          </button>

          {dropOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropHead}>
                <div className={styles.dropAvatar}>{initials}</div>
                <div>
                  <div className={styles.dropName}>{user?.display_name}</div>
                </div>
              </div>
              <button
                className={styles.dropItem}
                onClick={() => { setDisplayName(user?.display_name ?? ''); setEditOpen(true); setDropOpen(false) }}
              >
                ✏️ 編輯個人資料
              </button>
              <div className={styles.dropDivider} />
              <button className={`${styles.dropItem} ${styles.dropDanger}`} onClick={handleLogout}>
                🚪 登出
              </button>
            </div>
          )}
        </div>
      </header>

      {editOpen && (
        <Modal
          title="編輯個人資料"
          onClose={() => setEditOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setEditOpen(false)}>取消</button>
              <button className="btn btn-primary" form="edit-profile-form" type="submit">儲存變更</button>
            </>
          }
        >
          <form id="edit-profile-form" onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label className="form-label">顯示名稱</label>
              <input
                className="form-input"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="你的名字"
                required
              />
            </div>
          </form>
        </Modal>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
