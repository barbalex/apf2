// @flow
export default ({
  store,
  tree,
  messages,
}: {
  store: Object,
  tree: Object,
  messages: Array<Object>,
}): void => {
  const apArtId = tree.activeNodes.ap
  const existingQk = store.qk.get(apArtId)
  const newMessages = existingQk.messages.concat(messages)
  const value = {
    messages: newMessages,
  }
  store.qk.set(apArtId, value)
}
