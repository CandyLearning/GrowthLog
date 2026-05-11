import { apiClient } from '@/lib/api/client'
import type { GoalListResponse, CreateGoalRequest, UpdateGoalStatusRequest } from '@/lib/types'

export async function listGoals(): Promise<GoalListResponse> {
  return apiClient<GoalListResponse>('/goals')
}

export async function createGoal(body: CreateGoalRequest): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>('/goals', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateGoalStatus(goalId: number, body: UpdateGoalStatusRequest): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/goals/${goalId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}
