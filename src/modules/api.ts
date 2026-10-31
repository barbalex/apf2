/**
 * typed fetch wrapper for the PostgREST api (api.apflora.ch/postgrest,
 * see backend-dev/docker-compose.yml). Replaces Apollo as transport for
 * migrated modules — TanStack Query stays the orchestration layer.
 * Pattern proven in ae3 (src/modules/api.js) and vermehrung
 * (src/utils/apiClient.ts).
 */
import { jwtDecode } from 'jwt-decode'

import { camelToSnake } from './camelToSnake.ts'
import { tables } from './tables.ts'
import { store, userTokenAtom } from '../store/index.ts'

export const postgrestUri = () => {
  // check localhost BEFORE electron:
  // embedded browsers (electron host, IDE previews) would otherwise
  // silently talk to the production api while developing locally
  const hostnameWithoutWww = window.location.hostname.replace('www.', '')
  const isLocalhost = hostnameWithoutWww === 'localhost'

  return isLocalhost ?
      'http://localhost:3000'
    : 'https://api.apflora.ch/postgrest'
}

/** error with the PostgREST error body attached (code like "28P01") */
export class ApiError extends Error {
  code?: string | undefined
  status?: number | undefined
  details?: unknown | undefined
}

// headers with the login token attached; expires the token like the
// apollo auth link does (src/apolloClient.ts). An invalid or expired
// token is simply not sent — the request runs anonymous, the server
// answers 401/permission denied and the app opens the login dialog.
const authHeaders = () => {
  const headers = new Headers()
  const token = store.get(userTokenAtom)
  if (token) {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token)
      if (exp > Date.now() / 1000) {
        headers.set('authorization', `Bearer ${token}`)
      }
    } catch {
      // malformed token > request anonymous
    }
  }
  return headers
}

const buildError = async (res: Response): Promise<ApiError> => {
  const body = (await res.json().catch(() => null)) as {
    message?: string
    code?: string
    details?: unknown
  } | null
  const error = new ApiError(body?.message ?? res.statusText)
  error.code = body?.code
  error.status = res.status
  error.details = body?.details
  return error
}

export interface ApiFetchOptions {
  method?: string
  headers?: Record<string, string>
  body?: string
}

/**
 * fetch wrapper for the PostgREST api.
 * Throws ApiError with .code and .status from the PostgREST error body
 * on failure. Returns parsed JSON or null (mutations answer 204/201 with
 * an empty body when RLS hides the affected rows).
 */
export const apiFetch = async <T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T | null> => {
  const headers = authHeaders()
  const method = options.method?.toUpperCase() ?? 'GET'
  // mutations return no body by default: rls often hides the affected
  // rows, and an empty 2xx body would fail JSON parsing.
  // rpc calls (like login) DO return a body, so they are excluded
  if (method !== 'GET' && !path.startsWith('/rpc/')) {
    headers.set('Prefer', 'return=minimal')
  }
  Object.entries(options.headers ?? {}).forEach(([k, v]) => headers.set(k, v))
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch(`${postgrestUri()}${path}`, {
    ...options,
    headers,
  })
  if (!res.ok) throw await buildError(res)
  const text = await res.text()
  return text ? (JSON.parse(text) as T) : null
}

// insert one row or many; a JSON array body is also PostgREST's bulk syntax
export const apiInsert = <T>(table: string, rows: T | T[]) =>
  apiFetch(`/${table}`, {
    method: 'POST',
    body: JSON.stringify(Array.isArray(rows) ? rows : [rows]),
  })

// update rows by primary key (RLS decides which rows are actually affected)
export const apiUpdate = (table: string, id: string, patch: object) =>
  apiFetch(`/${table}?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })

export const apiDelete = (table: string, id: string) =>
  apiFetch(`/${table}?id=eq.${id}`, { method: 'DELETE' })

/**
 * PATCH a row by primary key, taking the legacy mutation-variables shape
 * ({ id, changedBy, ...camelCaseFields }) that the forms build today.
 * Transitional helper for the PostgREST migration — new code should call
 * apiUpdate directly with snake_case keys.
 */
export const apiUpdateByVariables = (
  appTable: string,
  variables: { id?: string | undefined; changedBy?: string | null } & Record<
    string,
    unknown
  >,
) => {
  const { id, changedBy, ...patch } = variables
  if (!id) throw new Error(`apiUpdateByVariables: ${appTable} has no id`)
  const dbTable = tables.find((t) => t.table === appTable)?.dbTable ?? appTable
  const body = Object.fromEntries(
    Object.entries(patch).map(([k, v]) => [camelToSnake(k), v]),
  )
  body.changed_by = changedBy
  return apiUpdate(dbTable, id, body)
}

// call a db function, e.g. rpc('login', { username, pass })
export const rpc = <T = unknown>(
  fn: string,
  args?: Record<string, unknown>,
  options: ApiFetchOptions = {},
) =>
  apiFetch<T>(`/rpc/${fn}`, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    body: JSON.stringify(args ?? {}),
  })

// total row count of a (filtered) resource, via Prefer: count=exact
export const apiCount = async (path: string): Promise<number> => {
  const headers = authHeaders()
  headers.set('Prefer', 'count=exact')
  const res = await fetch(
    `${postgrestUri()}${path}${path.includes('?') ? '&' : '?'}limit=0`,
    { headers },
  )
  if (!res.ok) throw await buildError(res)
  // e.g. "*/423"
  const range = res.headers.get('content-range') ?? '*/0'
  return parseInt(range.split('/')[1] ?? '0', 10) || 0
}

/**
 * total row count of a query_<table> RPC with a cascade filter — the filter
 * jsonb cannot be expressed as URL params, so the count comes from the
 * content-range header of the RPC call itself (p_limit stays unset: an
 * internal limit would cap the count too)
 */
export const rpcCount = async (
  fn: string,
  body: Record<string, unknown>,
): Promise<number> => {
  const headers = authHeaders()
  headers.set('Prefer', 'count=exact')
  headers.set('Content-Type', 'application/json')
  const res = await fetch(`${postgrestUri()}/rpc/${fn}?select=id`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) throw await buildError(res)
  const range = res.headers.get('content-range') ?? '*/0'
  return parseInt(range.split('/')[1] ?? '0', 10) || 0
}
