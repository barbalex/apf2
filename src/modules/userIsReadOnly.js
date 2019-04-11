import jwtDecode from 'jwt-decode'

export default (token, freiw) => {
  if (!token) return true
  const { role } = jwtDecode(token)
  if (!role) return true
  if (role === 'apflora_reader') return true
  if (!freiw && role === 'apflora_freiwillig') return true
  if (!!freiw && role === 'apflora_freiwillig') return false
  return false
}
