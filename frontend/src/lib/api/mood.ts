import { apiClient } from '@/lib/api/client'
import type { MoodListResponse, CreateMoodRequest } from '@/lib/types'
import type { MoodType } from '@/lib/types/mood.schema'

export async function listMoods(): Promise<MoodListResponse> {
  return apiClient<MoodListResponse>('/moods')
}

export async function createMood(body: CreateMoodRequest): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>('/moods', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateMood(
  entryId: number,
  body: { mood_type: MoodType; note?: string }
): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/moods/${entryId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteMood(entryId: number): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/moods/${entryId}`, {
    method: 'DELETE',
  })
}
