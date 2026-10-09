import { jwtDecode } from 'jwt-decode'

export const userIsReadOnly = (
  token: string | null | undefined,
  freiw?: boolean,
): boolean => {
  if (!token) return true
  const { role } = jwtDecode<{ role?: string }>(token)
  if (!role) return true
  if (role === 'apflora_reader') return true
  if (!freiw && role === 'apflora_freiwillig') return true
  if (!!freiw && role === 'apflora_freiwillig') return false
  return false
}
