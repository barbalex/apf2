import { types } from 'mobx-state-tree'
import uniq from 'lodash/uniq'

export default types
  .model('UrlQuery', {
    projekteTabs: types.optional(types.array(types.string), ['tree', 'daten']),
    apTab: types.optional(types.maybeNull(types.string), 'ap'),
    popTab: types.optional(types.maybeNull(types.string), 'pop'),
    tpopTab: types.optional(types.maybeNull(types.string), 'tpop'),
    tpopmassnTab: types.optional(types.maybeNull(types.string), 'tpopmassn'),
    feldkontrTab: types.optional(types.maybeNull(types.string), 'entwicklung'),
    idealbiotopTab: types.optional(
      types.maybeNull(types.string),
      'idealbiotop',
    ),
    qkTab: types.optional(types.maybeNull(types.string), 'qk'),
  })
  .actions((self) => ({
    addProjekteTab(tab) {
      self.projekteTabs = uniq([...self.projekteTabs, tab])
    },
  }))

export const defaultValue = {
  projekteTabs: ['tree', 'daten'],
  popTab: 'pop',
  tpopTab: 'tpop',
  tpopmassnTab: 'tpopmassn',
  apTab: 'ap',
  qkTab: 'qk',
  feldkontrTab: 'entwicklung',
  idealbiotopTab: 'idealbiotop',
}
