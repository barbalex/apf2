import { types, getParent } from 'mobx-state-tree'

export default types
  .model('Map', {
    popIdsFiltered: types.array(types.string),
    tpopIdsFiltered: types.array(types.string),
    beobNichtBeurteiltIdsFiltered: types.array(types.string),
    beobNichtZuzuordnenIdsFiltered: types.array(types.string),
    beobZugeordnetIdsFiltered: types.array(types.string),
    // icons: oneOf: normal, statusGroup, statusGroupSymbols
    popIcon: types.string,
    tpopIcon: types.string,
    // labels: oneOf: nr, name, none
    popLabel: types.string,
    tpopLabel: types.string,
  })
  .views((self) => ({
    get idsFiltered() {
      const tree = getParent(self)
      const { activeNodeArray } = tree
      const { activeApfloraLayers } = getParent(tree)
      if (!activeApfloraLayers.includes('mapFilter')) {
        return activeNodeArray.toJSON()
      }

      return [
        ...self.popIdsFiltered,
        ...self.tpopIdsFiltered,
        ...self.beobNichtBeurteiltIdsFiltered,
        ...self.beobNichtZuzuordnenIdsFiltered,
        ...self.beobZugeordnetIdsFiltered,
      ]
    },
  }))
  .actions((self) => ({
    setPopIdsFiltered(val) {
      self.popIdsFiltered = val
    },
    setTpopIdsFiltered(val) {
      self.tpopIdsFiltered = val
    },
    setBeobNichtBeurteiltIdsFiltered(val) {
      self.beobNichtBeurteiltIdsFiltered = val
    },
    setBeobNichtZuzuordnenIdsFiltered(val) {
      self.beobNichtZuzuordnenIdsFiltered = val
    },
    setBeobZugeordnetIdsFiltered(val) {
      self.beobZugeordnetIdsFiltered = val
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
  idsFiltered: [],
  popIdsFiltered: [],
  tpopIdsFiltered: [],
  beobNichtBeurteiltIdsFiltered: [],
  beobNichtZuzuordnenIdsFiltered: [],
  beobZugeordnetIdsFiltered: [],
  popIcon: 'normal',
  tpopIcon: 'normal',
  popLabel: 'nr',
  tpopLabel: 'nr',
}
