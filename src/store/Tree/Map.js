import { types } from 'mobx-state-tree'

export default types
  .model('Map', {
    // icons: oneOf: normal, statusGroup, statusGroupSymbols
    popIcon: types.string,
    tpopIcon: types.string,
    // labels: oneOf: nr, name, none
    popLabel: types.string,
    tpopLabel: types.string,
  })
  .actions((self) => ({
    setPopIcon(val) {
      self.popIcon = val
    },
    setTpopIcon(val) {
      self.tpopIcon = val
    },
    setPopLabel(val) {
      self.popLabel = val
    },
    setTpopLabel(val) {
      self.tpopLabel = val
    },
  }))

export const defaultValue = {
  popIcon: 'normal',
  tpopIcon: 'normal',
  popLabel: 'nr',
  tpopLabel: 'nr',
}
