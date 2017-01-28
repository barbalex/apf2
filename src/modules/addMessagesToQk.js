// @flow
import buildQkMessages from './buildQkMessages'

export default ({ store, messages }:{store:Object,messages:Array<Object>}) => {
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
