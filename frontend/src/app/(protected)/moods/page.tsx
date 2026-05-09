'use client'

import { useCallback, useEffect, useState } from 'react'
import { listMoods, createMood } from '@/lib/api/mood'
import { ApiClientError } from '@/lib/api/client'
import { Toast } from '@/components/Toast'
import type { MoodEntry, MoodType } from '@/lib/types/mood.schema'
import styles from './page.module.css'

const MOOD_OPTIONS: { type: MoodType; emoji: string; label: string; cls: string }[] = [
  { type: 'depressed', emoji: '😔', label: '沮喪',  cls: styles.mDepressed },
  { type: 'sad',       emoji: '😢', label: '難過',  cls: styles.mSad },
  { type: 'unhappy',   emoji: '😕', label: '不開心', cls: styles.mUnhappy },
  { type: 'neutral',   emoji: '😐', label: '普通',  cls: styles.mNeutral },
  { type: 'good',      emoji: '🙂', label: '不錯',  cls: styles.mGood },
  { type: 'happy',     emoji: '😄', label: '開心',  cls: styles.mHappy },
]

const MOOD_LABEL: Record<MoodType, string> = {
  depressed: '沮喪', sad: '難過', unhappy: '不開心', neutral: '普通', good: '不錯', happy: '開心',
}

export default function MoodsPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<MoodType | null>(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await listMoods()
      setEntries(res.entries)
    } catch {
      setToast('載入失敗')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    setSubmitting(true)
    try {
      await createMood({ mood_type: selected, note: note.trim() || undefined })
      setToast('心情記錄成功！小玉快樂值 +3 💛')
      setSelected(null)
      setNote('')
      refresh()
    } catch (err) {
      setToast(err instanceof ApiClientError ? err.message : '記錄失敗')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Recorder */}
      <div className={styles.recorder}>
        <div className={styles.recorderTitle}>今天的心情如何？🌈</div>
        <form onSubmit={handleSubmit}>
          <div className={styles.moodGrid}>
            {MOOD_OPTIONS.map(opt => (
              <button
                key={opt.type}
                type="button"
                className={`${styles.moodOption} ${opt.cls} ${selected === opt.type ? styles.selected : ''}`}
                onClick={() => setSelected(opt.type)}
                data-testid={`mood-${opt.type}`}
              >
                <span className={styles.moodEmoji}>{opt.emoji}</span>
                <span className={styles.moodLabel}>{opt.label}</span>
              </button>
            ))}
          </div>

          <label className={styles.noteLabel}>💬 說說今天發生了什麼？（選填）</label>
          <textarea
            className={styles.noteTextarea}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="今天有什麼特別的事嗎？心情好或不好的原因都可以寫下來，寫完之後心裡會輕鬆一點的 ☺️"
          />

          <div className={styles.submitRow}>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!selected || submitting}
              data-testid="submit-mood"
            >
              {submitting ? '記錄中…' : '記錄心情 ✦ 小玉 +3 💛'}
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="section-header" style={{ marginTop: 24 }}>
        <div>
          <h2>心情紀錄 ☁️</h2>
          <p>依日期排序，最新在前</p>
        </div>
      </div>

      {loading ? (
        <div className="state-box"><p className="loading-dots">載入中…</p></div>
      ) : entries.length === 0 ? (
        <div className="card">
          <div className="state-box">
            <div className="state-box-icon">☁️</div>
            <h3>還沒有心情紀錄</h3>
            <p>記錄今天的心情吧！</p>
          </div>
        </div>
      ) : (
        entries.map(entry => (
          <div key={entry.entry_id} className={styles.historyItem} data-testid={`mood-entry-${entry.entry_id}`}>
            <div className={styles.historyEmoji}>
              {MOOD_OPTIONS.find(m => m.type === entry.mood_type)?.emoji ?? '😐'}
            </div>
            <div className={styles.historyInfo}>
              <div className={styles.historyType}>{MOOD_LABEL[entry.mood_type]}</div>
              {entry.note && <div className={styles.historyNote}>{entry.note}</div>}
            </div>
            <div className={styles.historyDate}>{entry.entry_date}</div>
          </div>
        ))
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
