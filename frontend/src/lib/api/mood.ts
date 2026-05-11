import { apiClient } from '@/lib/api/client'
import type { MoodListResponse, CreateMoodRequest } from '@/lib/types'

export async function listMoods(): Promise<MoodListResponse> {
  return apiClient<MoodListResponse>('/moods')
}

export async function createMood(body: CreateMoodRequest): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>('/moods', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
