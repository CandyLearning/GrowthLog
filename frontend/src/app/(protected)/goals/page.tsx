'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { listGoals, createGoal, updateGoalStatus } from '@/lib/api/goal'
import { ApiClientError } from '@/lib/api/client'
import { Toast } from '@/components/Toast'
import { Modal } from '@/components/ui/Modal'
import type { Goal, GoalStatus } from '@/lib/types/goal.schema'
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

const ACCENT_COLORS = ['#8EC8A8', '#90B4D4', '#E8C0A0', '#E4AAAA']

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const [form, setForm] = useState({ title: '', description: '', start_date: '', end_date: '' })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const res = await listGoals()
      setGoals(res.goals)
    } catch {
      setToast('載入目標失敗')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setFormError('請填寫目標名稱'); return }
    setSubmitting(true); setFormError(null)
    try {
      await createGoal({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
      })
      setToast('🌱 目標建立成功！')
      setCreateOpen(false)
      setForm({ title: '', description: '', start_date: '', end_date: '' })
      refresh()
    } catch (err) {
      setFormError(err instanceof ApiClientError ? err.message : '建立失敗，請重試')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStatusChange(goalId: number, newStatus: GoalStatus) {
    try {
      await updateGoalStatus(goalId, { status: newStatus })
      setGoals(prev => prev.map(g => g.goal_id === goalId ? { ...g, status: newStatus } : g))
      setToast('狀態已更新 ✓')
    } catch (err) {
      setToast(err instanceof ApiClientError ? err.message : '更新失敗')
    }
  }

  return (
    <>
      <div className="section-header">
        <div>
          <h2>我的學習目標 🎯</h2>
          {!loading && (
            <p>共 {goals.length} 個目標・{goals.filter(g => g.status === 'in_progress').length} 個進行中</p>
          )}
        </div>
        <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>＋ 新增目標</button>
      </div>

      {loading ? (
        <div className="state-box"><p className="loading-dots">載入中…</p></div>
      ) : goals.length === 0 ? (
        <div className="card">
          <div className="state-box">
            <div className="state-box-icon">🎯</div>
            <h3>還沒有學習目標</h3>
            <p>設定第一個目標，開始你的成長旅程</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setCreateOpen(true)}>
              ＋ 新增第一個目標
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {goals.map((goal, i) => (
            <div
              key={goal.goal_id}
              className={styles.card}
              data-testid={`goal-card-${goal.goal_id}`}
            >
              <div className={styles.accent} style={{ background: ACCENT_COLORS[i % ACCENT_COLORS.length] }} />
              <div className={styles.cardHeader}>
                <div className={styles.goalTitle}>{goal.title}</div>
                <span className={`badge ${goal.status === 'in_progress' ? 'badge-mint' : goal.status === 'completed' ? 'badge-sky' : goal.status === 'abandoned' ? 'badge-gray' : 'badge-lemon'}`}>
                  {STATUS_LABEL[goal.status]}
                </span>
              </div>
              {goal.description && <p className={styles.goalDesc}>{goal.description}</p>}
              {(goal.start_date || goal.end_date) && (
                <p className={styles.goalDate}>
                  📅 {goal.start_date ?? '—'} ～ {goal.end_date ?? '無截止日'}
                </p>
              )}
              <div className={styles.cardActions}>
                <Link href={`/goals/${goal.goal_id}`} className="btn btn-secondary btn-sm">
                  查看紀錄
                </Link>
                <select
                  className={`status-pill ${goal.status}`}
                  value={goal.status}
                  onChange={(e) => handleStatusChange(goal.goal_id, e.target.value as GoalStatus)}
                  data-testid={`status-select-${goal.goal_id}`}
                >
                  {(Object.keys(STATUS_LABEL) as GoalStatus[]).map(s => (
                    <option
                      key={s} value={s}
                      disabled={s !== goal.status && !VALID_TRANSITIONS[goal.status].includes(s)}
                    >
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {createOpen && (
        <Modal
          title="新增學習目標 🎯"
          onClose={() => setCreateOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setCreateOpen(false)}>取消</button>
              <button className="btn btn-primary" form="create-goal-form" type="submit" disabled={submitting}>
                {submitting ? '建立中…' : '建立目標 🌱'}
              </button>
            </>
          }
        >
          <form id="create-goal-form" onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">目標名稱 <span style={{ color: 'var(--sakura-mid)' }}>*</span></label>
              <input
                className="form-input"
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="例如：學 TypeScript"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">描述（選填）</label>
              <textarea
                className="form-input"
                style={{ minHeight: 72 }}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="說明目標方向或學習重點…"
              />
            </div>
            <div className={styles.dateGrid}>
              <div className="form-group">
                <label className="form-label">開始日期</label>
                <input className="form-input" type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">截止日期</label>
                <input className="form-input" type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
              </div>
            </div>
            {formError && <p className={styles.formError}>{formError}</p>}
          </form>
        </Modal>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
