import { types } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'

import Ap from './Ap'

export default types
  .model('EkPlan', {
    showEk: types.optional(types.boolean, true),
    showEkf: types.optional(types.boolean, true),
    showCount: types.optional(types.boolean, true),
    showEkCount: types.optional(types.boolean, true),
    showMassn: types.optional(types.boolean, true),
    aps: types.optional(types.array(Ap), []),
  })
  .actions(self => ({
    setShowEk(val) {
      self.showEk = val
    },
    setShowEkf(val) {
      self.showEkf = val
    },
    setShowCount(val) {
      self.showCount = val
    },
    setShowEkCount(val) {
      self.showEkCount = val
    },
    setShowMassn(val) {
      self.showMassn = val
    },
    setAps(aps) {
      self.aps = aps
    },
    addAp(ap) {
      self.aps = [...self.aps, ap]
    },
    removeAp(ap) {
      self.aps = self.aps.filter(a => a.value !== ap.value)
    },
  }))
  .views(self => ({
    get apValues() {
      return self.aps.map(a => a.value)
    },
  }))

export const defaultValue = {
  showEk: true,
  showEkf: true,
  showCount: true,
  showEkCount: true,
  showMassn: true,
  aps: [],
}
