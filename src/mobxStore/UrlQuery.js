import { types } from 'mobx-state-tree'

export default types.model('UrlQuery', {
  projekteTabs: types.optional(types.array(types.string), ['tree', 'daten']),
  feldkontrTab: types.optional(types.maybeNull(types.string), 'entwicklung'),
})

export const defaultValue = {
  projekteTabs: ['tree', 'daten'],
  feldkontrTab: 'entwicklung',
}
