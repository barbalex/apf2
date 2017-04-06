// @flow
import buildQkMessages from './buildQkMessages'

const setQkFilter = ({ store, tree, filter }:{store:Object,tree:Object,filter:string}) => {
  const apArtId = tree.activeNodes.ap
  const existingQk = store.qk.get(apArtId)
  const { berichtjahr, messages } = existingQk
  const value = buildQkMessages({
    berichtjahr,
    messages,
    filter,
  })
  store.qk.set(apArtId, value)
}

export default setQkFilter
