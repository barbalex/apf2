//@flow
import jwtDecode from 'jwt-decode'

export default (token) => {
  if (!token) return true
  const { role } = jwtDecode(token)
  return (!role || role === 'apflora_reader')
}