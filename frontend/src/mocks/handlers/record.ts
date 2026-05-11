import { http, HttpResponse } from 'msw'
import { mockRecords } from '@/mocks/fixtures'
import { goalState } from './goal'
import type { LearningRecord } from '@/lib/types/record.schema'

// goalId → records[]
const recordsByGoal = new Map<number, LearningRecord[]>([
  [1, mockRecords.map(r => ({ ...r }))],
])
let nextRecordId = mockRecords.length + 1

function today(): string {
  return new Date().toISOString().split('T')[0]
}

export const recordHandlers = [
  // GET /api/v1/goals/:goalId/records — listRecords
  // 403: goal belongs to another user (ID < 0 simulates this)
  // 404: goal not found
  http.get('/api/v1/goals/:goalId/records', ({ params }) => {
    const goalId = Number(params.goalId)

    if (goalId < 0) {
      return HttpResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '無權查看他人目標的學習紀錄' } },
        { status: 403 }
      )
    }

    const goalExists = goalState.some(g => g.goal_id === goalId) || recordsByGoal.has(goalId)
    if (!goalExists) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '學習目標不存在' } },
        { status: 404 }
      )
    }

    const records = recordsByGoal.get(goalId) ?? []
    return HttpResponse.json({ success: true, data: { records } })
  }),

  // POST /api/v1/goals/:goalId/records — createRecord (multipart/form-data)
  // 400: title missing
  // 404: goal not found
  http.post('/api/v1/goals/:goalId/records', async ({ params, request }) => {
    const goalId = Number(params.goalId)
    const goalExists = goalState.some(g => g.goal_id === goalId) || recordsByGoal.has(goalId)

    if (!goalExists) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '學習目標不存在' } },
        { status: 404 }
      )
    }

    let title: string | null = null
    let content: string | undefined
    let image_url: string | undefined

    const contentType = request.headers.get('Content-Type') ?? ''
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      title = formData.get('title') as string | null
      content = (formData.get('content') as string | null) ?? undefined
      const imageFile = formData.get('image') as File | null
      if (imageFile && imageFile.size > 0) {
        image_url = URL.createObjectURL(imageFile)
      }
    } else {
      const body = await request.json() as { title?: string; content?: string }
      title = body.title ?? null
      content = body.content
    }

    if (!title || title.trim() === '') {
      return HttpResponse.json(
        { success: false, error: { code: 'MISSING_REQUIRED_FIELD', message: '學習紀錄標題為必填' } },
        { status: 400 }
      )
    }

    const newRecord: LearningRecord = {
      record_id: nextRecordId++,
      title,
      content,
      image_url,
      entry_date: today(),
    }
    const existing = recordsByGoal.get(goalId) ?? []
    recordsByGoal.set(goalId, [newRecord, ...existing])

    return HttpResponse.json({ success: true, data: { success: true } })
  }),

  // PATCH /api/v1/goals/:goalId/records/:recordId — updateRecord
  http.patch('/api/v1/goals/:goalId/records/:recordId', async ({ params, request }) => {
    const goalId = Number(params.goalId)
    const recordId = Number(params.recordId)
    const body = await request.json() as { title?: string; content?: string }

    if (!body.title || body.title.trim() === '') {
      return HttpResponse.json(
        { success: false, error: { code: 'MISSING_REQUIRED_FIELD', message: '標題為必填' } },
        { status: 400 }
      )
    }

    const records = recordsByGoal.get(goalId) ?? []
    const idx = records.findIndex(r => r.record_id === recordId)
    if (idx === -1) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '學習紀錄不存在' } },
        { status: 404 }
      )
    }

    records[idx] = { ...records[idx], title: body.title, content: body.content }
    recordsByGoal.set(goalId, records)

    return HttpResponse.json({ success: true, data: { success: true } })
  }),

  // DELETE /api/v1/goals/:goalId/records/:recordId — deleteRecord
  http.delete('/api/v1/goals/:goalId/records/:recordId', ({ params }) => {
    const goalId = Number(params.goalId)
    const recordId = Number(params.recordId)

    const records = recordsByGoal.get(goalId) ?? []
    const filtered = records.filter(r => r.record_id !== recordId)
    recordsByGoal.set(goalId, filtered)

    return HttpResponse.json({ success: true, data: { success: true } })
  }),
]
