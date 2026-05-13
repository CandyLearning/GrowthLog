const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'

interface ApiError {
  code?: string
  violation_type?: string
  message?: string
}

interface ApiEnvelope<T> {
  success?: boolean
  data?: T
  error?: ApiError
}

/**
 * Shared HTTP client for all API calls.
 * Worker should NOT create separate fetch logic — use this client.
 *
 * Auth: reads `auth-token` from document.cookie and sends as Bearer token.
 * This is production-safe — no mock-specific logic here.
 *
 * Supports two response formats:
 *   - MSW envelope: { success, data?, error? }
 *   - Backend direct: raw data object (no envelope)
 */
export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Read auth token from cookie (set by login page)
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)auth-token=([^;]*)/)
    if (match) {
      ;(headers as Record<string, string>)['Authorization'] = `Bearer ${match[1]}`
    }
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  const json: ApiEnvelope<T> = await res.json()

  // HTTP error → parse error details from body
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      document.cookie = 'auth-token=; path=/; max-age=0'
      window.location.replace('/login')
      return new Promise(() => {})
    }
    const err = json.error ?? {}
    throw new ApiClientError(
      err.code ?? err.violation_type ?? 'UNKNOWN',
      err.message ?? err.violation_type ?? res.statusText,
      res.status
    )
  }

  // Explicit success=false on 2xx (backend returns 200 with error body)
  if (typeof json.success === 'boolean' && !json.success) {
    const err = json.error ?? {}
    throw new ApiClientError(
      err.code ?? err.violation_type ?? 'UNKNOWN',
      err.message ?? err.violation_type ?? 'Request failed',
      res.status
    )
  }

  // Envelope format (MSW mock): { success: true, data: T }
  if ('data' in json && json.data !== undefined) {
    return json.data as T
  }

  // Direct format (backend actual response): raw data object
  return json as unknown as T
}

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}
