import { http, HttpResponse } from 'msw'
import { mockMoodEntries } from '@/mocks/fixtures'
import type { MoodEntry, MoodType } from '@/lib/types/mood.schema'

const VALID_MOOD_TYPES: MoodType[] = ['depressed', 'sad', 'unhappy', 'neutral', 'good', 'happy']

let moodState: MoodEntry[] = mockMoodEntries.map(e => ({ ...e }))
let nextEntryId = mockMoodEntries.length + 1

function today(): string {
  return new Date().toISOString().split('T')[0]
}

export const moodHandlers = [
  // GET /api/v1/moods — listMoods
  http.get('/api/v1/moods', () => {
    return HttpResponse.json({ success: true, data: { entries: moodState } })
  }),

  // POST /api/v1/moods — createMood
  // 400: mood_type missing or invalid
  http.post('/api/v1/moods', async ({ request }) => {
    const body = await request.json() as { mood_type?: string; note?: string; tag_ids?: number[] }

    if (!body.mood_type || body.mood_type.trim() === '') {
      return HttpResponse.json(
        { success: false, error: { code: 'MISSING_REQUIRED_FIELD', message: 'mood_type 為必填' } },
        { status: 400 }
      )
    }

    if (!VALID_MOOD_TYPES.includes(body.mood_type as MoodType)) {
      return HttpResponse.json(
        { success: false, error: { code: 'INVALID_VALUE', message: `mood_type 必須是 ${VALID_MOOD_TYPES.join(' / ')} 之一` } },
        { status: 400 }
      )
    }

    const newEntry: MoodEntry = {
      entry_id: nextEntryId++,
      mood_type: body.mood_type as MoodType,
      note: body.note,
      entry_date: today(),
    }
    moodState = [newEntry, ...moodState]

    return HttpResponse.json({ success: true, data: { success: true } })
  }),
]
