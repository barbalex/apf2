import { types } from 'mobx-state-tree'
import uniq from 'lodash/uniq'

export default types
  .model('UrlQuery', {
    projekteTabs: types.optional(types.array(types.string), ['tree', 'daten']),
    apTab: types.optional(types.maybeNull(types.string), 'ap'),
    tpopTab: types.optional(types.maybeNull(types.string), 'tpop'),
    feldkontrTab: types.optional(types.maybeNull(types.string), 'entwicklung'),
    idealbiotopTab: types.optional(
      types.maybeNull(types.string),
      'idealbiotop',
    ),
  })
  .actions(self => ({
    addProjekteTab(tab) {
      self.projekteTabs = uniq([...self.projekteTabs, tab])
    },
  }))

export const defaultValue = {
  projekteTabs: ['tree', 'daten'],
  tpopTab: 'tpop',
  apTab: 'ap',
  feldkontrTab: 'entwicklung',
  idealbiotopTab: 'idealbiotop',
}
