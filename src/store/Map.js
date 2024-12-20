import { types } from 'mobx-state-tree'

export const Map = types
  .model('Map', {
    // icons: oneOf: normal, statusGroup, statusGroupSymbols
    popIcon: types.string,
    tpopIcon: types.string,
    // labels: oneOf: nr, name, none
    popLabel: types.string,
    tpopLabel: types.string,
    beobDetailsOpen: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setBeobDetailsOpen(val) {
      self.beobDetailsOpen = val
    },
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
  popIcon: 'statusGroupSymbols',
  tpopIcon: 'statusGroupSymbols',
  popLabel: 'nr',
  tpopLabel: 'nr',
}
