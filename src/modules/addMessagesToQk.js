import buildQkMessages from './buildQkMessages'

export default ({ store, messages }) => {
  const apArtId = store.activeUrlElements.ap
  const existingQk = store.qk.get(apArtId)
  const newMessages = existingQk.messages.concat(messages)
  const filter = existingQk.filter
  const berichtjahr = existingQk.berichtjahr
  const value = buildQkMessages({
    berichtjahr,
    messages: newMessages,
    filter,
  })
  store.qk.set(apArtId, value)
}
