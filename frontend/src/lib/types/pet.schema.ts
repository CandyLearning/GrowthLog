import { z } from 'zod'

export const PetSpeciesSchema = z.enum([
  'capybara', 'dog', 'cat', 'snake', 'rabbit',
  'hamster', 'panda', 'penguin', 'fox', 'dragon',
])

export const PetSchema = z.object({
  species: PetSpeciesSchema,
  pet_name: z.string(),
  happiness: z.number().int(),
  fullness: z.number().int(),
  level: z.number().int(),
})

export const PetResponseSchema = z.object({
  pet: PetSchema,
})

export const CreatePetRequestSchema = z.object({
  species: PetSpeciesSchema,
  pet_name: z.string(),
})

export type PetSpecies = z.infer<typeof PetSpeciesSchema>
export type Pet = z.infer<typeof PetSchema>
export type PetResponse = z.infer<typeof PetResponseSchema>
export type CreatePetRequest = z.infer<typeof CreatePetRequestSchema>
