// @flow
import axios from 'axios'

export default async (
  store: Object,
  message: { id: number }
): Promise<void> => {
  const { id } = message
  try {
    await axios.post(`/usermessage/${store.user.name}/${id}`)
  } catch (error) {
    store.listError(error)
  }
  store.messages.messages = store.messages.messages.filter(m => m.id !== id)
}
