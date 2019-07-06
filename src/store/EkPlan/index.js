import { types } from 'mobx-state-tree'

import Ap from './Ap'

export default types
  .model('EkPlan', {
    showEk: types.optional(types.boolean, true),
    showEkf: types.optional(types.boolean, true),
    showCount: types.optional(types.boolean, true),
    showEkCount: types.optional(types.boolean, true),
    showMassn: types.optional(types.boolean, true),
    showAp: types.optional(types.boolean, true),
    showPopNr: types.optional(types.boolean, true),
    showPopName: types.optional(types.boolean, true),
    showTpopNr: types.optional(types.boolean, true),
    showTpopGemeinde: types.optional(types.boolean, true),
    showTpopFlurname: types.optional(types.boolean, true),
    showTpopStatus: types.optional(types.boolean, true),
    showTpopBekanntSeit: types.optional(types.boolean, true),
    showLink: types.optional(types.boolean, true),
    showEkAbrechnungstyp: types.optional(types.boolean, true),
    showEkfrequenz: types.optional(types.boolean, true),
    showEkfrequenzAbweichend: types.optional(types.boolean, true),
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
    setShowAp(val) {
      self.showAp = val
    },
    setShowPopNr(val) {
      self.showPopNr = val
    },
    setShowPopName(val) {
      self.showPopName = val
    },
    setShowTpopNr(val) {
      self.showTpopNr = val
    },
    setShowTpopGemeinde(val) {
      self.showTpopGemeinde = val
    },
    setShowTpopFlurname(val) {
      self.showTpopFlurname = val
    },
    setShowTpopStatus(val) {
      self.showTpopStatus = val
    },
    setShowTpopBekanntSeit(val) {
      self.showTpopBekanntSeit = val
    },
    setShowLink(val) {
      self.showLink = val
    },
    setShowEkAbrechnungstyp(val) {
      self.showEkAbrechnungstyp = val
    },
    setShowEkfrequenz(val) {
      self.showEkfrequenz = val
    },
    setShowEkfrequenzAbweichend(val) {
      self.showEkfrequenzAbweichend = val
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
  showAp: true,
  showPopNr: true,
  showPopName: true,
  showTpopNr: true,
  showTpopGemeinde: true,
  showTpopFlurname: true,
  showTpopStatus: true,
  showTpopBekanntSeit: true,
  showLink: true,
  showEkAbrechnungstyp: true,
  showEkfrequenz: true,
  showEkfrequenzAbweichend: true,
  aps: [],
}
