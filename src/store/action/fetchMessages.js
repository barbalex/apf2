// @flow
import axios from 'axios'

export default async (store: Object): Promise<void> => {
  const fetchUserMessages = async () => {
    let result
    try {
      result = await axios.get(`/usermessage/${store.user.name}`)
    } catch (error) {
      store.listError(error)
    }
    // $FlowIssue
    return result.data.map(m => m.MessageId)
  }
  const fetchMessages = async () => {
    let result
    try {
      result = await axios.get('/message')
    } catch (error) {
      store.listError(error)
    }
    // $FlowIssue
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
