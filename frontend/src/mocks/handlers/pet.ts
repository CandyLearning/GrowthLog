import { http, HttpResponse } from 'msw'
import { mockPet } from '@/mocks/fixtures'
import type { Pet, PetSpecies } from '@/lib/types/pet.schema'

const VALID_SPECIES: PetSpecies[] = [
  'capybara', 'dog', 'cat', 'snake', 'rabbit',
  'hamster', 'panda', 'penguin', 'fox', 'dragon',
]

// null means user has no pet yet
let petState: Pet | null = { ...mockPet }

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export const petHandlers = [
  // GET /api/v1/pet — getPet
  // 404: user has no pet
  http.get('/api/v1/pet', () => {
    if (!petState) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '尚未建立電子寵物' } },
        { status: 404 }
      )
    }
    return HttpResponse.json({ success: true, data: { pet: petState } })
  }),

  // POST /api/v1/pet — createPet
  // 400: missing required fields (species / pet_name)
  // 422: already has a pet, or invalid species
  http.post('/api/v1/pet', async ({ request }) => {
    const body = await request.json() as { species?: string; pet_name?: string }

    if (petState) {
      return HttpResponse.json(
        { success: false, error: { code: 'ALREADY_EXISTS', message: '每位使用者只能擁有一隻寵物' } },
        { status: 422 }
      )
    }

    if (!body.pet_name || body.pet_name.trim() === '') {
      return HttpResponse.json(
        { success: false, error: { code: 'MISSING_REQUIRED_FIELD', message: '寵物名稱為必填' } },
        { status: 400 }
      )
    }

    if (!body.species || !VALID_SPECIES.includes(body.species as PetSpecies)) {
      return HttpResponse.json(
        { success: false, error: { code: 'INVALID_VALUE', message: `species 必須是合法的 10 種之一` } },
        { status: 400 }
      )
    }

    petState = {
      species: body.species as PetSpecies,
      pet_name: body.pet_name,
      happiness: 100,
      fullness: 100,
      level: 1,
    }

    return HttpResponse.json({ success: true, data: { pet: petState } })
  }),

  // POST /api/v1/pet/feed — feedPet
  // 404: user has no pet
  http.post('/api/v1/pet/feed', () => {
    if (!petState) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '尚未建立電子寵物' } },
        { status: 404 }
      )
    }
    petState = { ...petState, fullness: clamp(petState.fullness + 20, 0, 100) }
    return HttpResponse.json({ success: true, data: { pet: petState } })
  }),

  // POST /api/v1/pet/interact — interactWithPet
  // 404: user has no pet
  http.post('/api/v1/pet/interact', () => {
    if (!petState) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '尚未建立電子寵物' } },
        { status: 404 }
      )
    }
    petState = { ...petState, happiness: clamp(petState.happiness + 5, 0, 100) }
    return HttpResponse.json({ success: true, data: { pet: petState } })
  }),
]

// Exported for cross-handler pet state updates (learning record / mood / gratitude bonuses)
export function applyPetBonus(type: 'record' | 'gratitude' | 'mood') {
  if (!petState) return
  const bonuses = { record: { happiness: 10, level_exp: 15 }, gratitude: { happiness: 8, level_exp: 10 }, mood: { happiness: 3, level_exp: 3 } }
  const bonus = bonuses[type]
  petState = { ...petState, happiness: clamp(petState.happiness + bonus.happiness, 0, 100) }
}
