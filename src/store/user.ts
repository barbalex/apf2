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

export const removeUserAtom = atom(null, (_get, set) => {
  set(userAtom, {
    name: '',
    token: null,
    id: null,
  })
})
