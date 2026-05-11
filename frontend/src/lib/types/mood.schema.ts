import { z } from 'zod'

export const MoodTypeSchema = z.enum(['depressed', 'sad', 'unhappy', 'neutral', 'good', 'happy'])

export const MoodEntrySchema = z.object({
  entry_id: z.number().int(),
  mood_type: MoodTypeSchema,
  note: z.string().optional(),
  entry_date: z.string(),
})

export const MoodListResponseSchema = z.object({
  entries: z.array(MoodEntrySchema),
})

export const CreateMoodRequestSchema = z.object({
  mood_type: MoodTypeSchema,
  note: z.string().optional(),
  tag_ids: z.array(z.number().int()).optional(),
})

export type MoodType = z.infer<typeof MoodTypeSchema>
export type MoodEntry = z.infer<typeof MoodEntrySchema>
export type MoodListResponse = z.infer<typeof MoodListResponseSchema>
export type CreateMoodRequest = z.infer<typeof CreateMoodRequestSchema>
