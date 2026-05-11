import { z } from 'zod'

export const GoogleAuthRequestSchema = z.object({
  google_id: z.string(),
  display_name: z.string(),
  avatar_url: z.string().optional(),
})

export const AuthResponseSchema = z.object({
  token: z.string(),
})

export const UserProfileSchema = z.object({
  user_id: z.number().int(),
  display_name: z.string(),
  avatar_url: z.string().optional(),
})

export const UpdateUserProfileRequestSchema = z.object({
  display_name: z.string().optional(),
  avatar_url: z.string().optional(),
})

export type GoogleAuthRequest = z.infer<typeof GoogleAuthRequestSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type UserProfile = z.infer<typeof UserProfileSchema>
export type UpdateUserProfileRequest = z.infer<typeof UpdateUserProfileRequestSchema>
