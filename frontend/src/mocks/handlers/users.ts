import { http, HttpResponse } from 'msw'
import { mockUser } from '@/mocks/fixtures'
import type { UserProfile } from '@/lib/types/auth.schema'

let currentUser: UserProfile = { ...mockUser }

function isAuthorized(request: Request): boolean {
  return !!request.headers.get('Authorization')
}

export const usersHandlers = [
  // GET /api/v1/users/me — getMyProfile
  // 401: missing Authorization header
  http.get('/api/v1/users/me', ({ request }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '請先登入' } },
        { status: 401 }
      )
    }
    return HttpResponse.json({ success: true, data: currentUser })
  }),

  // PATCH /api/v1/users/me — updateMyProfile
  // 401: missing Authorization header
  // 400: no valid field provided
  http.patch('/api/v1/users/me', async ({ request }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '請先登入' } },
        { status: 401 }
      )
    }

    const body = await request.json() as { display_name?: string; avatar_url?: string }
    if (!body.display_name && !body.avatar_url) {
      return HttpResponse.json(
        { success: false, error: { code: 'MISSING_REQUIRED_FIELD', message: '請提供要更新的欄位' } },
        { status: 400 }
      )
    }

    if (body.display_name) currentUser = { ...currentUser, display_name: body.display_name }
    if (body.avatar_url !== undefined) currentUser = { ...currentUser, avatar_url: body.avatar_url }

    return HttpResponse.json({ success: true, data: { success: true } })
  }),
]
