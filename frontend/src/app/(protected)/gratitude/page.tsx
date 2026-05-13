'use client'

import { useCallback, useEffect, useState } from 'react'
import { listGratitude, createGratitude, updateGratitude, deleteGratitude } from '@/lib/api/gratitude'
import { ApiClientError } from '@/lib/api/client'
import { Toast } from '@/components/Toast'
import { Modal } from '@/components/ui/Modal'
import { usePetName } from '@/lib/hooks/usePetName'
import type { GratitudeEntry } from '@/lib/types/gratitude.schema'
import styles from './page.module.css'

function groupByDate(entries: GratitudeEntry[]): [string, GratitudeEntry[]][] {
  const map = new Map<string, GratitudeEntry[]>()
  for (const e of entries) {
    const group = map.get(e.entry_date) ?? []
    group.push(e)
    map.set(e.entry_date, group)
  }
  return Array.from(map.entries())
}

function formatDate(date: string): string {
  const [y, m, d] = date.split('-')
  return `${y}年${Number(m)}月${Number(d)}日`
}

export default function GratitudePage() {
  const petName = usePetName()
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Edit modal
  const [editEntry, setEditEntry] = useState<GratitudeEntry | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const res = await listGratitude()
      setEntries(res.entries)
    } catch {
      setToast('載入失敗')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    try {
      await createGratitude({ content: content.trim() })
      setToast(`✨ 感謝已記錄！${petName}快樂值 +8 💛`)
      setContent('')
      refresh()
    } catch (err) {
      setToast(err instanceof ApiClientError ? err.message : '記錄失敗')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editEntry || !editContent.trim()) return
    setEditSubmitting(true)
    try {
      await updateGratitude(editEntry.entry_id, { content: editContent.trim() })
      setToast('感謝條目已更新 ✓')
      setEditEntry(null)
      refresh()
    } catch (err) {
      setToast(err instanceof ApiClientError ? err.message : '更新失敗')
    } finally {
      setEditSubmitting(false)
    }
  }

  async function handleDelete(entryId: number) {
    try {
      await deleteGratitude(entryId)
      setEntries(prev => prev.filter(e => e.entry_id !== entryId))
      setToast('已刪除 ✓')
    } catch (err) {
      setToast(err instanceof ApiClientError ? err.message : '刪除失敗')
    }
  }

  const groups = groupByDate(entries)

  return (
    <>
      {/* Composer */}
      <div className={styles.composer}>
        <div className={styles.composerTitle}>✨ 今天有什麼值得感謝的事？</div>
        <form onSubmit={handleCreate}>
          <textarea
            className={styles.composerTextarea}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="感謝…"
            data-testid="gratitude-input"
          />
          <div className={styles.composerFooter}>
            <button className="btn btn-peach" type="submit" disabled={!content.trim() || submitting}
              style={{ fontWeight: 700 }} data-testid="submit-gratitude">
              {submitting ? '記錄中…' : `記錄感謝 ✦ ${petName} +8 💛`}
            </button>
          </div>
        </form>
      </div>

      {/* Entries */}
      {loading ? (
        <div className="state-box"><p className="loading-dots">載入中…</p></div>
      ) : entries.length === 0 ? (
        <div className="card">
          <div className="state-box">
            <div className="state-box-icon">✨</div>
            <h3>還沒有感謝日記</h3>
            <p>記下今天值得感謝的事，培養感恩的習慣</p>
          </div>
        </div>
      ) : (
        groups.map(([date, group]) => (
          <div key={date} className={styles.dateGroup}>
            <div className={styles.dateLabel}>{formatDate(date)}</div>
            {group.map(entry => (
              <div key={entry.entry_id} className={styles.entry} data-testid={`gratitude-entry-${entry.entry_id}`}>
                <div className={styles.entryBullet}>✿</div>
                <div className={styles.entryContent}>{entry.content}</div>
                <div className={styles.entryActions}>
                  <button className="btn btn-ghost btn-icon"
                    onClick={() => { setEditEntry(entry); setEditContent(entry.content) }}
                    aria-label="編輯">✏️</button>
                  <button className="btn btn-ghost btn-icon"
                    onClick={() => handleDelete(entry.entry_id)}
                    aria-label="刪除">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Edit Modal */}
      {editEntry && (
        <Modal
          title="編輯感謝條目 ✨"
          onClose={() => setEditEntry(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setEditEntry(null)}>取消</button>
              <button className="btn btn-primary" form="edit-gratitude-form" type="submit" disabled={editSubmitting}>
                {editSubmitting ? '儲存中…' : '儲存'}
              </button>
            </>
          }
        >
          <form id="edit-gratitude-form" onSubmit={handleEdit}>
            <div className="form-group">
              <label className="form-label">感謝內容</label>
              <textarea
                className={`form-input ${styles.editTextarea}`}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
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
