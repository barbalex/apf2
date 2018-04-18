// @flow
import axios from 'axios'

export default async (
  store: Object,
  message: { id: number }
): Promise<void> => {
  const { id } = message
  try {
    await axios({
      method: 'POST',
      url: `/usermessage`,
      data: {
        user_name: store.user.name,
        message_id: id,
      },
    })
  } catch (error) {
    store.listError(error)
  }
  store.messages.messages = store.messages.messages.filter(m => m.id !== id)
}
