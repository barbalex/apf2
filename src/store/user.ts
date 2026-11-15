// the logged-in user (JWT)
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// User
export interface User {
  name: string
  token: string | null
  id: string | null
}

export const userAtom = atomWithStorage<User>(
  'user',
  {
    name: '',
    token: null,
    id: null,
  },
  undefined,
  { getOnInit: true },
)

export const userNameAtom = atom((get) => get(userAtom).name)
export const userTokenAtom = atom((get) => get(userAtom).token)

// the app role from the token's own role claim (base64url-decoded, not
// verified — the api verifies the signature on every request anyway)
export const userRoleAtom = atom((get) => {
  const token = get(userAtom).token
  if (!token) return null
  try {
    const base64 = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/')
    if (!base64) return null
    const payload = JSON.parse(atob(base64)) as { role?: string }
    return payload.role ?? null
  } catch {
    return null
  }
})

export const removeUserAtom = atom(null, (_get, set) => {
  set(userAtom, {
    name: '',
    token: null,
    id: null,
  })
})
