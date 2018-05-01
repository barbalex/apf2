// @flow
import { extendObservable, computed } from 'mobx'

import sortBy from 'lodash/sortBy'

export default (store: Object): void => {
  extendObservable(store.dropdownList, {
    adressen: computed(
      () =>
        sortBy(Array.from(store.table.adresse.values()), 'name').map(o => ({
          id: o.id,
          value: o.name,
        })),
      { name: 'dropdownListAdressen' }
    ),
    artListForAp: computed(
      () => {
        const aps = Array.from(store.table.ap.values())
        const alreadyUsedArtIds = aps.map(a => a.art_id)
        // let user choose active ap's art_id
        const activeAp = store.table.ap.get(store.tree.activeNodes.ap)
        const activeArtId = activeAp ? activeAp.art_id : null
        const artIdsNotToShow = alreadyUsedArtIds.filter(r => r !== activeArtId)
        const artList = Array.from(store.table.ae_eigenschaften.values())
          .filter(r => !artIdsNotToShow.includes(r.id))
          .map(o => ({ id: o.id, value: o.artname }))
        return sortBy(artList, 'value')
      },
      { name: 'dropdownListArtListForAp' }
    ),
    artnamen: computed(
      () =>
        Array.from(store.table.ae_eigenschaften.values())
          .map(a => a.artname)
          .sort(),
      { name: 'dropdownListArtnamen' }
    ),
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
