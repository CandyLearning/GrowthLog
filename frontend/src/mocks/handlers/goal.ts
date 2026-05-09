import { http, HttpResponse } from 'msw'
import { mockGoals } from '@/mocks/fixtures'
import type { Goal, GoalStatus } from '@/lib/types/goal.schema'

let goalState: Goal[] = mockGoals.map(g => ({ ...g }))
let nextGoalId = mockGoals.length + 1

const VALID_TRANSITIONS: Record<GoalStatus, GoalStatus[]> = {
  not_started: ['in_progress'],
  in_progress: ['completed', 'abandoned'],
  abandoned: ['in_progress'],
  completed: [],
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

export const goalHandlers = [
  // GET /api/v1/goals — listGoals
  http.get('/api/v1/goals', () => {
    return HttpResponse.json({ success: true, data: { goals: goalState } })
  }),

  // POST /api/v1/goals — createGoal
  // 400: title missing
  http.post('/api/v1/goals', async ({ request }) => {
    const body = await request.json() as { title?: string; description?: string; start_date?: string; end_date?: string }

    if (!body.title || body.title.trim() === '') {
      return HttpResponse.json(
        { success: false, error: { code: 'MISSING_REQUIRED_FIELD', message: '目標標題為必填' } },
        { status: 400 }
      )
    }

    const newGoal: Goal = {
      goal_id: nextGoalId++,
      title: body.title,
      description: body.description,
      start_date: body.start_date,
      end_date: body.end_date,
      status: 'not_started',
    }
    goalState = [...goalState, newGoal]

    return HttpResponse.json({ success: true, data: { success: true } })
  }),

  // PATCH /api/v1/goals/:goalId/status — updateGoalStatus
  // 403: goal belongs to another user (simulated: ID 0 range)
  // 404: goal not found
  // 422: invalid status transition
  http.patch('/api/v1/goals/:goalId/status', async ({ params, request }) => {
    const goalId = Number(params.goalId)
    const body = await request.json() as { status?: GoalStatus }
    const goal = goalState.find(g => g.goal_id === goalId)

    if (!goal) {
      return HttpResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: '學習目標不存在' } },
        { status: 404 }
      )
    }

    // 403: goal owned by another user (fixture IDs belong to mockUser; ID < 0 simulates other user's goal)
    if (goalId < 0) {
      return HttpResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '無權操作他人的學習目標' } },
        { status: 403 }
      )
    }

    const newStatus = body.status
    if (!newStatus || !VALID_TRANSITIONS[goal.status].includes(newStatus)) {
      return HttpResponse.json(
        { success: false, error: { code: 'INVALID_STATUS_TRANSITION', message: `無法從 ${goal.status} 轉換至 ${newStatus}` } },
        { status: 422 }
      )
    }

    goalState = goalState.map(g => g.goal_id === goalId ? { ...g, status: newStatus } : g)
    return HttpResponse.json({ success: true, data: { success: true } })
  }),
]

export { goalState, today }
