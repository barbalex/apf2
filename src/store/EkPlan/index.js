import { types } from 'mobx-state-tree'
import uniq from 'lodash/uniq'

import Ap from './Ap'

export const defaultFields = [
  'ap',
  'popNr',
  'popName',
  'nr',
  'gemeinde',
  'flurname',
  'status',
  'bekanntSeit',
  'link',
  'ekAbrechnungstyp',
  'ekfrequenz',
  'ekfrequenzAbweichend',
]
const initialYearClicked = {
  year: null,
  tpopId: null,
  title: null,
  ekPlan: false,
  ekfPlan: false,
}

export default types
  .model('EkPlan', {
    showEk: types.optional(types.boolean, true),
    showEkf: types.optional(types.boolean, true),
    showCount: types.optional(types.boolean, true),
    showEkCount: types.optional(types.boolean, true),
    showMassn: types.optional(types.boolean, true),
    aps: types.optional(types.array(Ap), []),
    fields: types.optional(
      types.array(types.union(types.string, types.number)),
      defaultFields,
    ),
    columnHovered: types.optional(types.union(types.string, types.number), ''),
  })
  .volatile(() => ({
    yearMenuAnchor: null,
    yearClicked: initialYearClicked,
  }))
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
    setFields(fields) {
      self.fields = fields
    },
    toggleField(field) {
      if (self.fields.includes(field)) {
        return self.removeField(field)
      }
      self.addField(field)
    },
    addField(field) {
      self.fields = uniq([...self.fields, field])
    },
    removeField(field) {
      self.fields = self.fields.filter(f => f !== field)
    },
    setYearMenuAnchor(anchor) {
      self.yearMenuAnchor = anchor
    },
    setYearClicked(val) {
      self.yearClicked = val
    },
    closeYearCellMenu() {
      self.yearMenuAnchor = null
      self.yearClicked = initialYearClicked
    },
    setColumnHovered(val) {
      self.columnHovered = val
    },
    resetYearHovered() {
      if (!self.yearClicked.year) self.columnHovered = 'none'
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
  fields: defaultFields,
  columnHovered: 'none',
  yearMenuAnchor: null,
  yearClicked: initialYearClicked,
}
