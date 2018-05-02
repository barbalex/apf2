// @flow
import { extendObservable, computed } from 'mobx'

import sortBy from 'lodash/sortBy'

export default (store: Object): void => {
  extendObservable(store.dropdownList, {
    zielTypWerte: computed(
      () => {
        let zielTypWerte = Array.from(store.table.ziel_typ_werte.values())
        zielTypWerte = sortBy(zielTypWerte, 'sort')
        return zielTypWerte.map(el => ({
          value: el.code,
          label: el.text,
        }))
      },
      { name: 'dropdownListZielTypWerte' }
    ),
  })
}
