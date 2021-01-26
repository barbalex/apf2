import { types } from 'mobx-state-tree'
import uniq from 'lodash/uniq'
import groupBy from 'lodash/groupBy'
import get from 'lodash/get'
import max from 'lodash/max'

import Ap from './Ap'
import Hovered, { defaultValue as defaultHovered } from './Hovered'
import fields from '../../components/EkPlan/Table/fields'

export const defaultFields = [
  'ap',
  'popNr',
  'nr',
  'ekfrequenz',
  'ekfrequenzStartjahr',
  'ekfrequenzAbweichend',
]
export const allFields = [
  'ap',
  'popNr',
  'popName',
  'popStatus',
  'nr',
  'gemeinde',
  'flurname',
  'status',
  'bekanntSeit',
  'lv95X',
  'lv95Y',
  'link',
  'ekfKontrolleur',
  'ekAbrechnungstyp',
  'ekfrequenz',
  'ekfrequenzStartjahr',
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
    aps: types.array(Ap),
    fields: types.optional(
      types.array(types.union(types.string, types.number)),
      defaultFields,
    ),
    hovered: types.optional(Hovered, defaultHovered),
    apsDataLoading: types.optional(types.boolean, true),
    filterAp: types.maybeNull(types.union(types.string, types.number)),
    filterPopNr: types.maybeNull(types.number),
    filterPopName: types.maybeNull(types.union(types.string, types.number)),
    filterPopStatus: types.maybeNull(types.union(types.string, types.number)),
    filterNr: types.maybeNull(types.union(types.string, types.number)),
    filterGemeinde: types.maybeNull(types.union(types.string, types.number)),
    filterFlurname: types.maybeNull(types.union(types.string, types.number)),
    filterStatus: types.maybeNull(types.union(types.string, types.number)),
    filterBekanntSeit: types.maybeNull(types.number),
    filterLv95X: types.maybeNull(types.union(types.string, types.number)),
    filterLv95Y: types.maybeNull(types.union(types.string, types.number)),
    filterEkfKontrolleur: types.maybeNull(
      types.union(types.string, types.number),
    ),
    filterEkAbrechnungstyp: types.maybeNull(
      types.union(types.string, types.number),
    ),
    filterEkfrequenz: types.maybeNull(types.union(types.string, types.number)),
    filterEkfrequenzStartjahr: types.maybeNull(
      types.union(types.string, types.number),
    ),
    filterEkfrequenzAbweichend: types.optional(types.boolean, false),
    filterEkfrequenzEmpty: types.optional(types.boolean, false),
    filterEkfrequenzStartjahrEmpty: types.optional(types.boolean, false),
    filterAnsiedlungYear: types.maybeNull(types.number, null),
    filterKontrolleYear: types.maybeNull(types.number, null),
    filterEkplanYear: types.maybeNull(types.number, null),
    pastYears: types.optional(types.number, 5),
  })
  .volatile(() => ({
    yearMenuAnchor: null,
    yearClicked: initialYearClicked,
    scrollPositions: null,
    apsData: [],
    ekfrequenzs: [],
  }))
  .actions((self) => ({
    setPastYears(val) {
      self.pastYears = val
    },
    setEkfrequenzs(val) {
      self.ekfrequenzs = val
    },
    setApsDataLoading(val) {
      self.apsDataLoading = val
    },
    setFilterAp(val) {
      self.filterAp = val
    },
    setFilterPopNr(val) {
      self.filterPopNr = val ? +val : null
    },
    setFilterPopName(val) {
      self.filterPopName = val
    },
    setFilterPopStatus(val) {
      self.filterPopStatus = val
    },
    setFilterNr(val) {
      self.filterNr = val ? +val : null
    },
    setFilterGemeinde(val) {
      self.filterGemeinde = val
    },
    setFilterFlurname(val) {
      self.filterFlurname = val
    },
    setFilterStatus(val) {
      self.filterStatus = val
    },
    setFilterBekanntSeit(val) {
      self.filterBekanntSeit = val ? +val : null
    },
    setFilterLv95X(val) {
      self.filterLv95X = val ? +val : null
    },
    setFilterLv95Y(val) {
      self.filterLv95Y = val ? +val : null
    },
    setFilterEkfKontrolleur(val) {
      self.filterEkfKontrolleur = val
    },
    setFilterEkAbrechnungstyp(val) {
      self.filterEkAbrechnungstyp = val
    },
    setFilterEkfrequenz(val) {
      self.filterEkfrequenz = val
    },
    setFilterEkfrequenzStartjahr(val) {
      self.filterEkfrequenzStartjahr = val ? +val : null
    },
    setFilterEkfrequenzAbweichend(val) {
      self.filterEkfrequenzAbweichend = val
    },
    setFilterEmptyEkfrequenz(val) {
      self.filterEkfrequenzEmpty = val
    },
    setFilterAnsiedlungYear(val) {
      self.filterAnsiedlungYear = val
    },
    setFilterKontrolleYear(val) {
      self.filterKontrolleYear = val
    },
    setFilterEkplanYear(val) {
      self.filterEkplanYear = val
    },
    setFilterEmptyEkfrequenzStartjahr(val) {
      self.filterEkfrequenzStartjahrEmpty = val
    },
    setApsData(val) {
      self.apsData = val
    },
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
    addAp(ap) {
      self.aps = [...self.aps, ap]
    },
    removeAp(ap) {
      self.aps = self.aps.filter((a) => a.value !== ap.value)
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
      self.fields = self.fields.filter((f) => f !== field)
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
    setScrollPositions(val) {
      self.scrollPositions = val
    },
  }))
  .views((self) => ({
    get apValues() {
      return self.aps.map((a) => a.value)
    },
    get ekfOptionsGroupedPerAp() {
      const longestAnwendungsfall = max(
        self.ekfrequenzs.map((a) => (a.anwendungsfall || '').length),
      )
      const options = self.ekfrequenzs.map((o) => {
        const code = (o.code || '').padEnd(9, '\xA0')
        const anwendungsfall =
          `${(o.anwendungsfall || '').padEnd(longestAnwendungsfall, '\xA0')}` ||
          ''
        return {
          value: o.id,
          label: `${code}: ${anwendungsfall}`,
          anwendungsfall,
          apId: o.apId,
        }
      })
      const os = groupBy(options, 'apId')
      return os
    },
    get einheitsByAp() {
      const e = groupBy(get(self.apsData, 'allAps.nodes', []), 'id')
      Object.keys(e).forEach(
        (apId) =>
          (e[apId] = get(e[apId][0], 'ekzaehleinheitsByApId.nodes', []).map(
            (o) => o.tpopkontrzaehlEinheitWerteByZaehleinheitId.code,
          )),
      )
      return e
    },
    get scrollPositions() {
      const fieldsShown = self.fields
      const ap = {
        left: 0,
        right: fieldsShown.includes('ap') ? fields.ap.width : 0,
      }
      const popNr = {
        left: ap.right,
        right: fieldsShown.includes('popNr')
          ? ap.right + fields.popNr.width
          : ap.right,
      }
      const popName = {
        left: popNr.right,
        right: fieldsShown.includes('popName')
          ? popNr.right + fields.popName.width
          : popNr.right,
      }
      const popStatus = {
        left: popName.right,
        right: fieldsShown.includes('popStatus')
          ? popName.right + fields.popStatus.width
          : popName.right,
      }
      const nr = {
        left: popStatus.right,
        right: fieldsShown.includes('nr')
          ? popStatus.right + fields.nr.width
          : popStatus.right,
      }
      const gemeinde = {
        left: nr.right,
        right: fieldsShown.includes('gemeinde')
          ? nr.right + fields.gemeinde.width
          : nr.right,
      }
      const flurname = {
        left: gemeinde.right,
        right: fieldsShown.includes('flurname')
          ? gemeinde.right + fields.flurname.width
          : gemeinde.right,
      }
      const status = {
        left: flurname.right,
        right: fieldsShown.includes('status')
          ? flurname.right + fields.status.width
          : flurname.right,
      }
      const bekanntSeit = {
        left: status.right,
        right: fieldsShown.includes('bekanntSeit')
          ? status.right + fields.bekanntSeit.width
          : status.right,
      }
      const link = {
        left: bekanntSeit.right,
        right: fieldsShown.includes('link')
          ? bekanntSeit.right + fields.link.width
          : bekanntSeit.right,
      }
      const ekAbrechnungstyp = {
        left: link.right,
        right: fieldsShown.includes('ekAbrechnungstyp')
          ? link.right + fields.ekAbrechnungstyp.width
          : link.right,
      }
      const ekfrequenz = {
        left: ekAbrechnungstyp.right,
        right: fieldsShown.includes('ekfrequenz')
          ? ekAbrechnungstyp.right + fields.ekfrequenz.width
          : ekAbrechnungstyp.right,
      }
      const ekfrequenzStartjahr = {
        left: ekfrequenz.right,
        right: fieldsShown.includes('ekfrequenzStartjahr')
          ? ekfrequenz.right + fields.ekfrequenzStartjahr.width
          : ekfrequenz.right,
      }
      const ekfrequenzAbweichend = {
        left: ekfrequenzStartjahr.right,
        right: fieldsShown.includes('ekfrequenzAbweichend')
          ? ekfrequenzStartjahr.right + fields.ekfrequenzAbweichend.width
          : ekfrequenzStartjahr.right,
      }
      const yearTitle = {
        left: ekfrequenzAbweichend.right,
        right: fieldsShown.includes('yearTitle')
          ? ekfrequenzAbweichend.right + fields.yearTitle.width
          : ekfrequenzAbweichend.right,
      }

      return {
        ap: ap.left,
        popNr: popNr.left,
        popName: popName.left,
        popStatus: popStatus.left,
        nr: nr.left,
        gemeinde: gemeinde.left,
        flurname: flurname.left,
        status: status.left,
        bekanntSeit: bekanntSeit.left,
        link: link.left,
        ekAbrechnungstyp: ekAbrechnungstyp.left,
        ekfrequenz: ekfrequenz.left,
        ekfrequenzStartjahr: ekfrequenzStartjahr.left,
        ekfrequenzAbweichend: ekfrequenzAbweichend.left,
        yearTitle: yearTitle.left,
      }
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
  hovered: defaultHovered,
  yearMenuAnchor: null,
  yearClicked: initialYearClicked,
  apsDataLoading: true,
  filterAp: null,
  filterPopNr: null,
  filterPopName: null,
  filterPopStatus: null,
  filterNr: null,
  filterGemeinde: null,
  filterFlurname: null,
  filterStatus: null,
  filterBekanntSeit: null,
  filterLv95X: null,
  filterLv95Y: null,
  filterEkAbrechnungstyp: null,
  filterEkfrequenz: null,
  filterEkfrequenzStartjahr: null,
  filterEkfrequenzAbweichend: false,
  filterEkfrequenzEmpty: false,
  filterEkfrequenzStartjahrEmpty: false,
  filterAnsiedlungYear: null,
  filterKontrolleYear: null,
  filterEkplanYear: null,
  apsData: [],
  pastYears: 5,
  scrollPositions: null,
  ekfrequenzs: [],
}
