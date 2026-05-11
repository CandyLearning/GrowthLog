import { z } from 'zod'

export const LearningRecordSchema = z.object({
  record_id: z.number().int(),
  title: z.string(),
  content: z.string().optional(),
  image_url: z.string().optional(),
  entry_date: z.string(),
})

export const RecordListResponseSchema = z.object({
  records: z.array(LearningRecordSchema),
})

export type LearningRecord = z.infer<typeof LearningRecordSchema>
export type RecordListResponse = z.infer<typeof RecordListResponseSchema>
