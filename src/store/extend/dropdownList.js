// @flow
import { extendObservable, computed } from 'mobx'

import sortBy from 'lodash/sortBy'

export default (store: Object): void => {
  extendObservable(store.dropdownList, {
    apErfkritWerte: computed(
      () => {
        let apErfkritWerte = Array.from(store.table.ap_erfkrit_werte.values())
        apErfkritWerte = sortBy(apErfkritWerte, 'sort')
        return apErfkritWerte.map(el => ({
          value: el.code,
          label: el.text,
        }))
      },
      { name: 'dropdownListApErfkritWerte' }
    ),
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
