import { http, HttpResponse } from 'msw'
import { mockGratitudeEntries } from '@/mocks/fixtures'
import type { GratitudeEntry } from '@/lib/types/gratitude.schema'

let gratitudeState: GratitudeEntry[] = mockGratitudeEntries.map(e => ({ ...e }))
let nextEntryId = mockGratitudeEntries.reduce((max, e) => Math.max(max, e.entry_id), 0) + 1

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function findEntry(entryId: number) {
  return gratitudeState.find(e => e.entry_id === entryId)
}

export const gratitudeHandlers = [
  // GET /api/v1/gratitude — listGratitude
  http.get('/api/v1/gratitude', () => {
    return HttpResponse.json({ success: true, data: { entries: gratitudeState } })
  }),

  // POST /api/v1/gratitude — createGratitude
  // 400: content missing
  http.post('/api/v1/gratitude', async ({ request }) => {
    const body = await request.json() as { content?: string }

    if (!body.content || body.content.trim() === '') {
      return HttpResponse.json(
        { success: false, error: { code: 'MISSING_REQUIRED_FIELD', message: '感謝內容為必填' } },
        { status: 400 }
      )
    }

    const newEntry: GratitudeEntry = {
      entry_id: nextEntryId++,
      content: body.content,
      entry_date: today(),
    }
    gratitudeState = [newEntry, ...gratitudeState]

    return HttpResponse.json({ success: true, data: { success: true } })
  }),

  // PATCH /api/v1/gratitude/:entryId — updateGratitude
  // 400: content missing
  // 403: not owner (IDs outside mockUser's set are treated as other user's)
  // 404: not found
  http.patch('/api/v1/gratitude/:entryId', async ({ params, request }) => {
    const entryId = Number(params.entryId)
    const entry = findEntry(entryId)

    if (!entry) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '感謝條目不存在' } },
        { status: 404 }
      )
    }

    // 403: entries created by mockUser have IDs in fixture range; simulate other-user entry via negative ID
    if (entryId < 0) {
      return HttpResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '無權編輯他人的感謝條目' } },
        { status: 403 }
      )
    }

    const body = await request.json() as { content?: string }
    if (!body.content || body.content.trim() === '') {
      return HttpResponse.json(
        { success: false, error: { code: 'MISSING_REQUIRED_FIELD', message: '感謝內容為必填' } },
        { status: 400 }
      )
    }

    gratitudeState = gratitudeState.map(e =>
      e.entry_id === entryId ? { ...e, content: body.content! } : e
    )

    return HttpResponse.json({ success: true, data: { success: true } })
  }),

  // DELETE /api/v1/gratitude/:entryId — deleteGratitude
  // 403: not owner
  // 404: not found
  http.delete('/api/v1/gratitude/:entryId', ({ params }) => {
    const entryId = Number(params.entryId)
    const entry = findEntry(entryId)

    if (!entry) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '感謝條目不存在' } },
        { status: 404 }
      )
    }

    if (entryId < 0) {
      return HttpResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '無權刪除他人的感謝條目' } },
        { status: 403 }
      )
    }

    gratitudeState = gratitudeState.filter(e => e.entry_id !== entryId)
    return HttpResponse.json({ success: true, data: { success: true } })
  }),
]
