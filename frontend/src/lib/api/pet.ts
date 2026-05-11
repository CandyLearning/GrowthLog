import { apiClient } from '@/lib/api/client'
import type { PetResponse, CreatePetRequest } from '@/lib/types'

export async function getPet(): Promise<PetResponse> {
  return apiClient<PetResponse>('/pet')
}

export async function createPet(body: CreatePetRequest): Promise<PetResponse> {
  return apiClient<PetResponse>('/pet', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function feedPet(): Promise<PetResponse> {
  return apiClient<PetResponse>('/pet/feed', { method: 'POST' })
}

export async function interactWithPet(): Promise<PetResponse> {
  return apiClient<PetResponse>('/pet/interact', { method: 'POST' })
}
