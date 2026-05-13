import { z } from 'zod'

export const GoalStatusSchema = z.enum(['not_started', 'in_progress', 'completed', 'abandoned'])

export const GoalSchema = z.object({
  goal_id: z.number().int(),
  title: z.string(),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: GoalStatusSchema,
})

export const GoalListResponseSchema = z.object({
  goals: z.array(GoalSchema),
})

export const CreateGoalRequestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

export const UpdateGoalStatusRequestSchema = z.object({
  status: GoalStatusSchema,
})

export const UpdateGoalRequestSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

export type GoalStatus = z.infer<typeof GoalStatusSchema>
export type Goal = z.infer<typeof GoalSchema>
export type GoalListResponse = z.infer<typeof GoalListResponseSchema>
export type CreateGoalRequest = z.infer<typeof CreateGoalRequestSchema>
export type UpdateGoalStatusRequest = z.infer<typeof UpdateGoalStatusRequestSchema>
export type UpdateGoalRequest = z.infer<typeof UpdateGoalRequestSchema>
