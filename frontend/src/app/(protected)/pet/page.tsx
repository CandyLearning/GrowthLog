'use client'

import { useCallback, useEffect, useState } from 'react'
import { getPet, createPet, feedPet, interactWithPet, renamePet } from '@/lib/api/pet'
import { ApiClientError } from '@/lib/api/client'
import { Toast } from '@/components/Toast'
import type { Pet, PetSpecies } from '@/lib/types/pet.schema'
import styles from './page.module.css'

const SPECIES_LIST: { value: PetSpecies; emoji: string; label: string }[] = [
  { value: 'capybara', emoji: '🦫', label: '卡皮巴拉' },
  { value: 'dog',      emoji: '🐕', label: '狗' },
  { value: 'cat',      emoji: '🐈', label: '貓' },
  { value: 'snake',    emoji: '🐍', label: '蛇' },
  { value: 'rabbit',   emoji: '🐇', label: '兔子' },
  { value: 'hamster',  emoji: '🐹', label: '倉鼠' },
  { value: 'panda',    emoji: '🐼', label: '熊貓' },
  { value: 'penguin',  emoji: '🐧', label: '企鵝' },
  { value: 'fox',      emoji: '🦊', label: '狐狸' },
  { value: 'dragon',   emoji: '🐲', label: '龍' },
]

const SPECIES_EMOJI: Record<PetSpecies, string> = Object.fromEntries(
  SPECIES_LIST.map(s => [s.value, s.emoji])
) as Record<PetSpecies, string>

const SPECIES_LABEL: Record<PetSpecies, string> = Object.fromEntries(
  SPECIES_LIST.map(s => [s.value, s.label])
) as Record<PetSpecies, string>

export default function PetPage() {
  const [pet, setPet] = useState<Pet | null | 'loading'>('loading')
  const [toast, setToast] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState('')

  // Create pet form
  const [selectedSpecies, setSelectedSpecies] = useState<PetSpecies>('capybara')
  const [petName, setPetName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await getPet()
      setPet(res.pet)
    } catch (err) {
      if (err instanceof ApiClientError && (err.status === 404 || err.code === 'NOT_FOUND')) {
        setPet(null) // no pet yet
      } else {
        setToast('載入失敗')
        setPet(null)
      }
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  function notifyPetUpdated() {
    window.dispatchEvent(new CustomEvent('pet-updated'))
  }

  async function handleFeed() {
    setActionLoading(true)
    try {
      const res = await feedPet()
      setPet(res.pet)
      notifyPetUpdated()
      setToast('🍖 餵食成功！飽食度增加了～')
    } catch (err) {
      setToast(err instanceof ApiClientError ? err.message : '餵食失敗')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleInteract() {
    setActionLoading(true)
    try {
      const res = await interactWithPet()
      setPet(res.pet)
      notifyPetUpdated()
      setToast('🤚 撫摸成功！小傢伙很開心！')
    } catch (err) {
      setToast(err instanceof ApiClientError ? err.message : '互動失敗')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleRename(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setActionLoading(true)
    try {
      const res = await renamePet({ pet_name: newName.trim() })
      setPet(res.pet)
      notifyPetUpdated()
      setRenaming(false)
      setToast(`✏️ 已改名為 ${newName.trim()}！`)
    } catch (err) {
      setToast(err instanceof ApiClientError ? err.message : '改名失敗')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!petName.trim()) { setCreateError('請為你的寵物取個名字'); return }
    setCreating(true); setCreateError(null)
    try {
      const res = await createPet({ species: selectedSpecies, pet_name: petName.trim() })
      setPet(res.pet)
      setToast(`🎉 ${petName.trim()} 領養成功！`)
    } catch (err) {
      setCreateError(err instanceof ApiClientError ? err.message : '建立失敗，請重試')
    } finally {
      setCreating(false)
    }
  }

  if (pet === 'loading') {
    return <div className="state-box"><p className="loading-dots">載入中…</p></div>
  }

  if (pet === null) {
    return (
      <>
        <div className={styles.createCard}>
          <div className={styles.createTitle}>🐾 領養你的夥伴</div>
          <div className={styles.createSub}>選一隻你喜歡的寵物，一起記錄成長吧！</div>
          <form onSubmit={handleCreate}>
            <div className={styles.speciesGrid}>
              {SPECIES_LIST.map(s => (
                <button
                  key={s.value}
                  type="button"
                  className={`${styles.speciesOpt} ${selectedSpecies === s.value ? styles.speciesSelected : ''}`}
                  onClick={() => setSelectedSpecies(s.value)}
                  data-testid={`species-${s.value}`}
                >
                  <span className={styles.speciesEmoji}>{s.emoji}</span>
                  <span className={styles.speciesName}>{s.label}</span>
                </button>
              ))}
            </div>
            <div className={styles.createForm}>
              <input
                className={styles.createInput}
                type="text"
                value={petName}
                onChange={e => setPetName(e.target.value)}
                placeholder="幫牠取個名字 ♡"
                data-testid="pet-name-input"
              />
              {createError && <p className={styles.createError}>{createError}</p>}
              <button className="btn btn-primary" type="submit" disabled={creating}
                style={{ width: '100%', justifyContent: 'center', padding: '12px 20px' }}
                data-testid="create-pet-btn">
                {creating ? '領養中…' : '領養這隻寵物 ✨'}
              </button>
            </div>
          </form>
        </div>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </>
    )
  }

  return (
    <>
      <div className={styles.layout}>
        {/* Pet Display */}
        <div className={styles.display}>
          <div className={styles.displayName}>
            {renaming ? (
              <form onSubmit={handleRename} className={styles.renameRow}>
                <input
                  className={styles.renameInput}
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  autoFocus
                  maxLength={20}
                  data-testid="rename-input"
                />
                <button type="submit" className={styles.renameConfirm} disabled={actionLoading} data-testid="rename-confirm-btn">✓</button>
                <button type="button" className={styles.renameCancel} onClick={() => setRenaming(false)}>✕</button>
              </form>
            ) : (
              <span className={styles.displayNameInner}>
                {pet.pet_name}
                <button
                  className={styles.renameBtn}
                  onClick={() => { setNewName(pet.pet_name); setRenaming(true) }}
                  data-testid="rename-btn"
                  title="改名"
                >✏️</button>
              </span>
            )}
          </div>
          <div className={styles.displaySpecies}>
            {SPECIES_LABEL[pet.species]} · Lv.{pet.level}
          </div>
          <div className={styles.petFace}>
            {SPECIES_EMOJI[pet.species]}
            <div className={styles.levelTag}>Lv.{pet.level}</div>
          </div>
          <div className={styles.statsBlock}>
            <div className={styles.statRow}>
              <span className={styles.statIcon}>💛</span>
              <div className={styles.statTrack}>
                <div className={`${styles.statFill} ${styles.fillHappy}`} style={{ width: `${Math.min(100, pet.happiness)}%` }} />
              </div>
              <span className={styles.statNum}>{pet.happiness}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statIcon}>🍖</span>
              <div className={styles.statTrack}>
                <div className={`${styles.statFill} ${styles.fillFullness}`} style={{ width: `${Math.min(100, pet.fullness)}%` }} />
              </div>
              <span className={styles.statNum}>{pet.fullness}</span>
            </div>
          </div>
        </div>

        {/* Actions Panel */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>互動 🌸</div>
          <button className={styles.actionRow} onClick={handleFeed} disabled={actionLoading} data-testid="feed-btn">
            <div className={`${styles.actionIcon} ${styles.iconFeed}`}>🍖</div>
            <div>
              <div className={styles.actionName}>餵食</div>
              <div className={styles.actionSub}>飽食度 +20</div>
            </div>
          </button>
          <button className={styles.actionRow} onClick={handleInteract} disabled={actionLoading} data-testid="interact-btn">
            <div className={`${styles.actionIcon} ${styles.iconTouch}`}>🤚</div>
            <div>
              <div className={styles.actionName}>撫摸</div>
              <div className={styles.actionSub}>快樂值提升，建立感情</div>
            </div>
          </button>

          <div className={styles.bonusBox}>
            <div className={styles.bonusTitle}>成長連動獎勵 ✦</div>
            <div className={styles.bonusRow}><span>📝 新增學習紀錄</span><span className={styles.bonusVal}>快樂 +10</span></div>
            <div className={styles.bonusRow}><span>✨ 記錄感謝</span><span className={styles.bonusVal}>快樂 +8</span></div>
            <div className={styles.bonusRow}><span>😊 記錄心情</span><span className={styles.bonusVal}>快樂 +3</span></div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
