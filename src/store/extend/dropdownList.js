// @flow
import { extendObservable, computed } from 'mobx'

import sortBy from 'lodash/sortBy'
import filter from 'lodash/filter'

export default (store: Object): void => {
  extendObservable(store.dropdownList, {
    adressen: computed(
      () => sortBy(Array.from(store.table.adresse.values()), 'AdrName'),
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
        apStati = sortBy(apStati, 'DomainOrd')
        return apStati.map(el => ({
          value: el.DomainCode,
          label: el.DomainTxt,
        }))
      },
      { name: 'dropdownListApStati' }
    ),
    artListForAp: computed(
      () => {
        const alreadyUsedApIds = Array.from(store.table.ap.keys()).map(a =>
          Number(a)
        )
        // let user choose store ApArtId
        const apArtIdsNotToShow = alreadyUsedApIds.filter(
          r => r !== store.tree.activeNodes.ap
        )
        const artList = filter(
          Array.from(store.table.adb_eigenschaften.values()),
          r => !apArtIdsNotToShow.includes(r.TaxonomieId)
        )
        return sortBy(artList, 'Artname')
      },
      { name: 'dropdownListArtListForAp' }
    ),
    artnamen: computed(
      () => {
        let artnamen = Array.from(store.table.adb_eigenschaften.values())
        artnamen = artnamen.map(a => a.Artname).sort()
        // artnamen.unshift('')
        return artnamen
      },
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
        gemeinden = sortBy(gemeinden, 'GmdName')
        return gemeinden.map(el => el.GmdName)
      },
      { name: 'dropdownListGemeinden' }
    ),
    idbiotopuebereinstWerte: computed(
      () => {
        let idbiotopuebereinstWerte = Array.from(
          store.table.tpopkontr_idbiotuebereinst_werte.values()
        )
        idbiotopuebereinstWerte = sortBy(idbiotopuebereinstWerte, 'sort')
        return idbiotopuebereinstWerte.map(el => ({
          value: el.code,
          label: el.text,
        }))
      },
      { name: 'dropdownListIdbiotopuebereinstWerte' }
    ),
    lr: computed(
      () =>
        Array.from(store.table.adb_lr.values()).map(
          e => `${e.Label}: ${e.Einheit.replace(/  +/g, ' ')}`
        ),
      { name: 'dropdownListLr' }
    ),
    zaehleinheitWerte: computed(
      () => {
        let zaehleinheitWerte = Array.from(
          store.table.tpopkontrzaehl_einheit_werte.values()
        )
        zaehleinheitWerte = sortBy(zaehleinheitWerte, 'sort')
        zaehleinheitWerte = zaehleinheitWerte.map(el => ({
          value: el.code,
          label: el.text,
        }))
        return zaehleinheitWerte
      },
      { name: 'dropdownListZaehleinheitWerte' }
    ),
    methodeWerte: computed(
      () => {
        let methodeWerte = Array.from(
          store.table.tpopkontrzaehl_methode_werte.values()
        )
        methodeWerte = sortBy(methodeWerte, 'sort')
        methodeWerte = methodeWerte.map(el => ({
          value: el.code,
          label: el.text,
        }))
        return methodeWerte
      },
      { name: 'dropdownListMethodeWerte' }
    ),
    tpopMassnTypWerte: computed(
      () => {
        let tpopMassnTypWerte = Array.from(
          store.table.tpopmassn_typ_werte.values()
        )
        tpopMassnTypWerte = sortBy(tpopMassnTypWerte, 'sort')
        return tpopMassnTypWerte.map(el => ({
          value: el.code,
          label: el.text,
        }))
      },
      { name: 'dropdownListTpopMassnTypWerte' }
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
