'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { listGoals, updateGoalStatus } from '@/lib/api/goal'
import { listRecords, createRecord } from '@/lib/api/record'
import { ApiClientError } from '@/lib/api/client'
import { Toast } from '@/components/Toast'
import { Modal } from '@/components/ui/Modal'
import type { Goal, GoalStatus } from '@/lib/types/goal.schema'
import type { LearningRecord } from '@/lib/types/record.schema'
import styles from './page.module.css'

const STATUS_LABEL: Record<GoalStatus, string> = {
  not_started: '尚未開始',
  in_progress: '進行中',
  completed:   '已完成',
  abandoned:   '放棄',
}

const VALID_TRANSITIONS: Record<GoalStatus, GoalStatus[]> = {
  not_started: ['in_progress'],
  in_progress: ['completed', 'abandoned'],
  abandoned:   ['in_progress'],
  completed:   [],
}

export default function GoalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const goalId = Number(params.goalId)

  const [goal, setGoal] = useState<Goal | null>(null)
  const [records, setRecords] = useState<LearningRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const [form, setForm] = useState({ title: '', content: '', image: null as File | null })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const [goalsRes, recordsRes] = await Promise.all([
        listGoals(),
        listRecords(goalId),
      ])
      const found = goalsRes.goals.find(g => g.goal_id === goalId)
      if (!found) { router.replace('/goals'); return }
      setGoal(found)
      setRecords(recordsRes.records)
    } catch {
      setToast('載入失敗，請重試')
    } finally {
      setLoading(false)
    }
  }, [goalId, router])

  useEffect(() => { refresh() }, [refresh])

  async function handleStatusChange(newStatus: GoalStatus) {
    if (!goal) return
    try {
      await updateGoalStatus(goalId, { status: newStatus })
      setGoal(g => g ? { ...g, status: newStatus } : g)
      setToast('狀態已更新 ✓')
    } catch (err) {
      setToast(err instanceof ApiClientError ? err.message : '更新失敗')
    }
  }

  function handleClose() {
    setAddOpen(false)
    setForm({ title: '', content: '', image: null })
    setFormError(null)
  }

  async function handleAddRecord(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setFormError('請填寫紀錄標題'); return }
    setSubmitting(true); setFormError(null)
    try {
      await createRecord(goalId, {
        title: form.title.trim(),
        content: form.content.trim() || undefined,
        image: form.image ?? undefined,
      })
      setToast('📝 學習紀錄新增成功！小玉快樂值 +10 💛')
      setAddOpen(false)
      setForm({ title: '', content: '', image: null })
      refresh()
    } catch (err) {
      setFormError(err instanceof ApiClientError ? err.message : '新增失敗，請重試')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="state-box"><p className="loading-dots">載入中…</p></div>
  if (!goal) return null

  return (
    <>
      {/* Goal Header */}
      <div className={styles.goalHeader}>
        <div className={styles.goalHeaderAccent} />
        <div className={styles.goalHeaderBody}>
          <div className={styles.goalHeaderTop}>
            <div>
              <span className={`badge ${goal.status === 'in_progress' ? 'badge-mint' : goal.status === 'completed' ? 'badge-sky' : goal.status === 'abandoned' ? 'badge-gray' : 'badge-lemon'}`} style={{ marginBottom: 8, display: 'inline-flex' }}>
                {STATUS_LABEL[goal.status]}
              </span>
              <h1 className={styles.goalTitle}>{goal.title}</h1>
              {goal.description && <p className={styles.goalDesc}>{goal.description}</p>}
            </div>
            <select
              className={`status-pill ${goal.status}`}
              value={goal.status}
              onChange={e => handleStatusChange(e.target.value as GoalStatus)}
              style={{ flexShrink: 0, marginTop: 4 }}
            >
              {(Object.keys(STATUS_LABEL) as GoalStatus[]).map(s => (
                <option key={s} value={s} disabled={s !== goal.status && !VALID_TRANSITIONS[goal.status].includes(s)}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          {(goal.start_date || goal.end_date) && (
            <div className={styles.dates}>
              {goal.start_date && (
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>開始日期</span>
                  <span className={styles.dateValue}>{goal.start_date}</span>
                </div>
              )}
              {goal.end_date && (
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>截止日期</span>
                  <span className={styles.dateValue}>{goal.end_date}</span>
                </div>
              )}
              <div className={styles.dateItem}>
                <span className={styles.dateLabel}>學習紀錄</span>
                <span className={styles.dateValue}>{records.length} 筆</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Records */}
      <div className={styles.recordsHeader}>
        <div className={styles.recordsTitle}>學習紀錄 📝</div>
        <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>＋ 新增紀錄</button>
      </div>

      {records.length === 0 ? (
        <div className="card">
          <div className="state-box">
            <div className="state-box-icon">📝</div>
            <h3>還沒有學習紀錄</h3>
            <p>記錄今天的學習，讓小玉開心！</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setAddOpen(true)}>
              ＋ 新增第一筆紀錄
            </button>
          </div>
        </div>
      ) : (
        records.map(record => (
          <div key={record.record_id} className={styles.recordCard} data-testid={`record-${record.record_id}`}>
            <div className={styles.recordTop}>
              <div className={styles.recordTitle}>{record.title}</div>
              <span className={styles.recordDate}>{record.entry_date}</span>
            </div>
            {record.content && <p className={styles.recordContent}>{record.content}</p>}
            {record.image_url && (
              <img
                src={record.image_url}
                alt={record.title}
                className={styles.recordImage}
              />
            )}
          </div>
        ))
      )}

      {addOpen && (
        <Modal
          title="新增學習紀錄 📝"
          onClose={handleClose}
          footer={
            <>
              <button className="btn btn-secondary" onClick={handleClose}>取消</button>
              <button className="btn btn-mint" form="add-record-form" type="submit" disabled={submitting}
                style={{ color: '#fff' }}>
                {submitting ? '新增中…' : '新增紀錄 🌱'}
              </button>
            </>
          }
        >
          <form id="add-record-form" onSubmit={handleAddRecord}>
            <div className="form-group">
              <label className="form-label">紀錄標題 <span style={{ color: 'var(--sakura-mid)' }}>*</span></label>
              <input className="form-input" type="text" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="例如：今天學了 list comprehension" required />
            </div>
            <div className="form-group">
              <label className="form-label">學習內容（選填）</label>
              <textarea className="form-input" style={{ minHeight: 90 }}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="記錄今天學了什麼，有什麼心得或收穫…" />
            </div>
            <div className="form-group">
              <label className="form-label">附圖（選填）</label>
              <div className={styles.uploadZone}>
                <div className={styles.uploadLabel}>
                  <span className={styles.uploadIcon}>📸</span>
                  <span>{form.image ? form.image.name : '點擊上傳或拖放圖片'}</span>
                  <small>支援 JPG、PNG、GIF</small>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.uploadInput}
                  onChange={e => setForm(f => ({ ...f, image: e.target.files?.[0] ?? null }))}
                />
              </div>
            </div>
            <div className={styles.petHint}>
              🐾 新增紀錄後，小玉的快樂值將增加 +10！
            </div>
            {formError && <p className={styles.formError}>{formError}</p>}
          </form>
        </Modal>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
