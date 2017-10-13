// @flow
import axios from 'axios'
import initiateDataFromUrl from './initiateDataFromUrl'

export default ({
  store,
  name,
  role,
  token,
}: {
  store: Object,
  name: string,
  role: string,
  token: string,
}) => {
  store.user.name = name
  store.user.role = role
  store.user.token = token
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  initiateDataFromUrl(store)
}
