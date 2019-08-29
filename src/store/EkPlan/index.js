import { types } from 'mobx-state-tree'
import uniq from 'lodash/uniq'
import groupBy from 'lodash/groupBy'
import get from 'lodash/get'

import Ap from './Ap'
import Hovered, { defaultValue as defaultHovered } from './Hovered'
import fields from '../../components/EkPlan/Table/fields'

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
    aps: types.optional(types.array(Ap), []),
    fields: types.optional(
      types.array(types.union(types.string, types.number)),
      defaultFields,
    ),
    hovered: types.optional(Hovered, defaultHovered),
    apsDataLoading: types.optional(types.boolean, true),
  })
  .volatile(() => ({
    yearMenuAnchor: null,
    yearClicked: initialYearClicked,
    scrollPositions: null,
    apsData: [],
    ekfrequenzs: [],
  }))
  .actions(self => ({
    setEkfrequenzs(val) {
      self.ekfrequenzs = val
    },
    setApsDataLoading(val) {
      self.apsDataLoading = val
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
    setScrollPositions(val) {
      self.scrollPositions = val
    },
  }))
  .views(self => ({
    get apValues() {
      return self.aps.map(a => a.value)
    },
    get ekfOptionsGroupedPerAp() {
      const options = self.ekfrequenzs.map(o => {
        const ekTypeArray = [o.ek ? 'ek' : null, o.ekf ? 'ekf' : null].filter(
          field => !!field,
        )
        const code = (o.code || '').padEnd(2)
        const anwendungsfall = (
          `${o.anwendungsfall}, ${ekTypeArray.join(' und ')}` || ''
        ).padEnd(26)
        const name = (o.name || '').padEnd(27)
        return {
          value: o.code,
          label: `${code}: ${name}`,
          anwendungsfall,
          apId: o.apId,
        }
      })
      const os = groupBy(options, 'apId')
      Object.keys(os).forEach(k => (os[k] = groupBy(os[k], 'anwendungsfall')))
      return os
    },
    get einheitsByAp() {
      const e = groupBy(get(self.apsData, 'allAps.nodes', []), 'id')
      Object.keys(e).forEach(
        apId =>
          (e[apId] = get(e[apId][0], 'ekzaehleinheitsByApId.nodes', []).map(
            o => o.tpopkontrzaehlEinheitWerteByZaehleinheitId.code,
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
      const nr = {
        left: popName.right,
        right: fieldsShown.includes('nr')
          ? popName.right + fields.nr.width
          : popName.right,
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
  apsData: [],
}
