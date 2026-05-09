import { http, HttpResponse } from 'msw'

const MOCK_TOKEN = 'mock-session-token-dev'

export const authHandlers = [
  // POST /api/v1/auth/google — googleOAuthCallback
  // 400: google_id or display_name missing
  http.post('/api/v1/auth/google', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>

    if (!body.google_id || !body.display_name) {
      return HttpResponse.json(
        { success: false, error: { code: 'MISSING_REQUIRED_FIELD', message: 'google_id 與 display_name 為必填' } },
        { status: 400 }
      )
    }

    return HttpResponse.json({ success: true, data: { token: MOCK_TOKEN } })
  }),
]
