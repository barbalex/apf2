// @flow
import buildQkMessages from './buildQkMessages'

export default ({
  store,
  tree,
  messages
}: { store: Object, tree: Object, messages: Array<Object> }): void => {
  const apArtId = tree.activeNodes.ap
  const existingQk = store.qk.get(apArtId)
  const newMessages = existingQk.messages.concat(messages)
  const filter = existingQk.filter
  const berichtjahr = existingQk.berichtjahr
  const value = buildQkMessages({
    berichtjahr,
    messages: newMessages,
    filter
  })
  store.qk.set(apArtId, value)
}
