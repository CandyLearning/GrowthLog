import { apiClient } from '@/lib/api/client'
import type { GratitudeListResponse, CreateGratitudeRequest, UpdateGratitudeRequest } from '@/lib/types'

export async function listGratitude(): Promise<GratitudeListResponse> {
  return apiClient<GratitudeListResponse>('/gratitude')
}

export async function createGratitude(body: CreateGratitudeRequest): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>('/gratitude', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateGratitude(entryId: number, body: UpdateGratitudeRequest): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/gratitude/${entryId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteGratitude(entryId: number): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/gratitude/${entryId}`, {
    method: 'DELETE',
  })
}
