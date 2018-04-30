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
    apUmsetzungen: computed(
      () => {
        let apUmsetzungen = Array.from(store.table.ap_umsetzung_werte.values())
        apUmsetzungen = sortBy(apUmsetzungen, 'sort')
        return apUmsetzungen.map(el => ({
          value: el.code,
          label: el.text,
        }))
      },
      { name: 'dropdownListApUmsetzungen' }
    ),
    apStati: computed(
      () => {
        let apStati = Array.from(store.table.ap_bearbstand_werte.values())
        apStati = sortBy(apStati, 'sort')
        return apStati.map(el => ({
          value: el.code,
          label: el.text,
        }))
      },
      { name: 'dropdownListApStati' }
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
    tpopEntwicklungWerte: computed(
      () => {
        let tpopEntwicklungWerte = Array.from(
          store.table.tpop_entwicklung_werte.values()
        )
        tpopEntwicklungWerte = sortBy(tpopEntwicklungWerte, 'sort')
        return tpopEntwicklungWerte.map(el => ({
          value: el.code,
          label: el.text,
        }))
      },
      { name: 'dropdownListTpopEntwicklungWerte' }
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
    tpopmassnErfbeurtWerte: computed(
      () => {
        let tpopmassnErfbeurtWerte = Array.from(
          store.table.tpopmassn_erfbeurt_werte.values()
        )
        tpopmassnErfbeurtWerte = sortBy(tpopmassnErfbeurtWerte, 'sort')
        return tpopmassnErfbeurtWerte.map(el => ({
          value: el.code,
          label: el.text,
        }))
      },
      { name: 'dropdownListTpopmassnErfbeurtWerte' }
    ),
    tpopApBerichtRelevantWerte: computed(
      () => {
        const tpopApBerichtRelevantWerte = Array.from(
          store.table.tpop_apberrelevant_werte.values()
        )
        return tpopApBerichtRelevantWerte.map(t => ({
          value: t.code,
          label: t.text,
        }))
      },
      { name: 'dropdownListTpopApBerichtRelevantWerte' }
    ),
    gemeinden: computed(
      () => {
        let gemeinden = Array.from(store.table.gemeinde.values())
        gemeinden = sortBy(gemeinden, 'name')
        return gemeinden.map(el => el.name)
      },
      { name: 'dropdownListGemeinden' }
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
