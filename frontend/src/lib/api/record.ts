import { apiClient, ApiClientError } from '@/lib/api/client'
import type { RecordListResponse } from '@/lib/types'

export async function updateRecord(
  goalId: number,
  recordId: number,
  body: { title: string; content?: string }
): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/goals/${goalId}/records/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteRecord(goalId: number, recordId: number): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/goals/${goalId}/records/${recordId}`, {
    method: 'DELETE',
  })
}

export async function listRecords(goalId: number): Promise<RecordListResponse> {
  return apiClient<RecordListResponse>(`/goals/${goalId}/records`)
}

// multipart/form-data — bypasses apiClient to avoid Content-Type: application/json conflict
export async function createRecord(
  goalId: number,
  body: { title: string; content?: string; image?: File }
): Promise<{ success: boolean }> {
  const formData = new FormData()
  formData.append('title', body.title)
  if (body.content) formData.append('content', body.content)
  if (body.image) formData.append('image', body.image)

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'
  const headers: Record<string, string> = {}

  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)auth-token=([^;]*)/)
    if (match) headers['Authorization'] = `Bearer ${match[1]}`
  }

  const res = await fetch(`${baseUrl}/goals/${goalId}/records`, {
    method: 'POST',
    body: formData,
    headers,
  })

  const json = await res.json() as { success: boolean; data?: { success: boolean }; error?: { code: string; message: string } }
  if (!res.ok || !json.success) {
    const err = json.error ?? { code: 'UNKNOWN', message: res.statusText }
    throw new ApiClientError(err.code, err.message, res.status)
  }
  return json.data as { success: boolean }
}
