import jwtDecode from 'jwt-decode'

const userIsReadOnly = (token, freiw) => {
  if (!token) return true
  const { role } = jwtDecode(token)
  if (!role) return true
  if (role === 'apflora_reader') return true
  if (!freiw && role === 'apflora_freiwillig') return true
  if (!!freiw && role === 'apflora_freiwillig') return false
  return false
}

export default userIsReadOnly
