//@flow
import jwtDecode from 'jwt-decode'

export default ({ token }) => {
  const { role } = jwtDecode(token)
  return (!role || role === 'apflora_reader')
}