import { types } from 'mobx-state-tree'
import uniq from 'lodash/uniq'

export default types
  .model('UrlQuery', {
    projekteTabs: types.optional(types.array(types.string), ['tree', 'daten']),
    feldkontrTab: types.optional(types.maybeNull(types.string), 'entwicklung'),
  })
  .actions(self => ({
    addProjekteTab(tab) {
      self.projekteTabs = uniq([...self.projekteTabs, tab])
    },
  }))

export const defaultValue = {
  projekteTabs: ['tree', 'daten'],
  feldkontrTab: 'entwicklung',
}
