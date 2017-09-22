// @flow
import axios from 'axios'

export default async (store: Object): Promise<void> => {
  const fetchUserMessages = async () => {
    let result
    try {
      result = await axios.get(`/usermessage?UserName=eq.${store.user.name}`)
    } catch (error) {
      store.listError(error)
    }
    if (result && result.data) {
      return result.data.map(m => m.MessageId)
    }
    return []
  }
  const fetchMessages = async () => {
    let result
    try {
      result = await axios.get('/message?active=eq.true')
    } catch (error) {
      store.listError(error)
    }
    if (!result || !result.data) {
      return []
    }
    return result.data
  }
  const [messages, userMessages] = await Promise.all([
    fetchMessages(),
    fetchUserMessages(),
  ])
  const unreadMessages = messages.filter(m => !userMessages.includes(m.id))
  store.messages.messages = unreadMessages
  store.messages.setFetched(unreadMessages)
}
