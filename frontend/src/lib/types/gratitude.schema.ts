import { z } from 'zod'

export const GratitudeEntrySchema = z.object({
  entry_id: z.number().int(),
  content: z.string(),
  entry_date: z.string(),
})

export const GratitudeListResponseSchema = z.object({
  entries: z.array(GratitudeEntrySchema),
})

export const CreateGratitudeRequestSchema = z.object({
  content: z.string(),
})

export const UpdateGratitudeRequestSchema = z.object({
  content: z.string(),
})

export type GratitudeEntry = z.infer<typeof GratitudeEntrySchema>
export type GratitudeListResponse = z.infer<typeof GratitudeListResponseSchema>
export type CreateGratitudeRequest = z.infer<typeof CreateGratitudeRequestSchema>
export type UpdateGratitudeRequest = z.infer<typeof UpdateGratitudeRequestSchema>
