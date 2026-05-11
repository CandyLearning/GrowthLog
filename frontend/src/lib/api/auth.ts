import { apiClient } from '@/lib/api/client'
import type { GoogleAuthRequest, AuthResponse, UserProfile, UpdateUserProfileRequest } from '@/lib/types'

export async function googleOAuthCallback(body: GoogleAuthRequest): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getMyProfile(): Promise<UserProfile> {
  return apiClient<UserProfile>('/users/me')
}

export async function updateMyProfile(body: UpdateUserProfileRequest): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}
