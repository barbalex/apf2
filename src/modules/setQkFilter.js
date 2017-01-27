import buildQkMessages from './buildQkMessages'

const setQk = ({ store, filter }) => {
  const apArtId = store.activeUrlElements.ap
  const existingQk = store.qk.get(apArtId)
  const { berichtjahr, messages } = existingQk
  const value = buildQkMessages({
    berichtjahr,
    messages,
    filter,
  })
  store.qk.set(apArtId, value)
}

export default setQk
