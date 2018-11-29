import { types } from 'mobx-state-tree'

export default types
  .model('Map', {
    idsFiltered: types.array(types.union(types.string, types.number)),
    popIdsFiltered: types.array(types.string),
    tpopIdsFiltered: types.array(types.string),
    beobNichtBeurteiltIdsFiltered: types.array(types.string),
    beobNichtZuzuordnenIdsFiltered: types.array(types.string),
    beobZugeordnetIdsFiltered: types.array(types.string),
  })
  .actions(self => ({
    setIdsFiltered(val) {
      self.idsFiltered = val
    },
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
  }))

export const defaultValue = {
  idsFiltered: [],
  popIdsFiltered: [],
  tpopIdsFiltered: [],
  beobNichtBeurteiltIdsFiltered: [],
  beobNichtZuzuordnenIdsFiltered: [],
  beobZugeordnetIdsFiltered: [],
}
