'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getPet } from '@/lib/api/pet'
import type { Pet } from '@/lib/types/pet.schema'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { href: '/goals',     label: '學習目標', emoji: '🎯', dotClass: styles.dotGoal },
  { href: '/moods',     label: '心情紀錄', emoji: '☁️', dotClass: styles.dotMood },
  { href: '/gratitude', label: '感謝日記', emoji: '✨', dotClass: styles.dotGratitude },
  { href: '/pet',       label: '電子寵物', emoji: '🐾', dotClass: styles.dotPet },
]

const SPECIES_EMOJI: Record<string, string> = {
  capybara: '🦫', dog: '🐕', cat: '🐈', snake: '🐍', rabbit: '🐇',
  hamster: '🐹', panda: '🐼', penguin: '🐧', fox: '🦊', dragon: '🐲',
}

export function Sidebar() {
  const pathname = usePathname()
  const [pet, setPet] = useState<Pet | null>(null)

  useEffect(() => {
    const refresh = () =>
      getPet().then((res) => setPet(res.pet)).catch(() => setPet(null))
    refresh()
    window.addEventListener('pet-updated', refresh)
    return () => window.removeEventListener('pet-updated', refresh)
  }, [])

  return (
    <aside className={styles.sidebar} data-testid="sidebar">
      <div className={styles.brand}>
        <Link href="/goals">
          <h1 className={styles.brandTitle}>🌸 GrowthLog</h1>
        </Link>
        <p className={styles.brandSub}>個人成長追蹤</p>
      </div>

      <nav className={styles.nav} data-testid="sidebar-nav">
        <div className={styles.navLabel}>主功能</div>
        {NAV_ITEMS.map(({ href, label, dotClass }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${pathname.startsWith(href) ? styles.navItemActive : ''}`}
          >
            <span className={`${styles.navDot} ${dotClass}`} />
            {label}
          </Link>
        ))}
      </nav>

      <div className={styles.petWidget}>
        <div className={styles.petWidgetLabel}>我的夥伴 🐾</div>
        {pet ? (
          <div className={styles.petCard}>
            <div className={styles.petFace}>
              {SPECIES_EMOJI[pet.species] ?? '🐾'}
            </div>
            <div className={styles.petInfo}>
              <div className={styles.petName}>{pet.pet_name}</div>
              <div className={styles.petBars}>
                <div className={styles.petBarRow}>
                  <span className={styles.petBarIcon}>💛</span>
                  <div className={styles.petBarTrack}>
                    <div className={`${styles.petBarFill} ${styles.fillHappy}`} style={{ width: `${Math.min(100, pet.happiness)}%` }} />
                  </div>
                </div>
                <div className={styles.petBarRow}>
                  <span className={styles.petBarIcon}>🍖</span>
                  <div className={styles.petBarTrack}>
                    <div className={`${styles.petBarFill} ${styles.fillFullness}`} style={{ width: `${Math.min(100, pet.fullness)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Link href="/pet" className={styles.petNone}>
            領養你的第一隻寵物 →
          </Link>
        )}
      </div>
    </aside>
  )
}
