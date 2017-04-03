// @flow
import { extendObservable, computed } from 'mobx'

import sortBy from 'lodash/sortBy'
import filter from 'lodash/filter'

export default (store:Object) => {
  extendObservable(store.dropdownList, {
    adressen: computed(
      () => {
        const adressen = sortBy(
          Array.from(store.table.adresse.values()),
          `AdrName`
        )
        adressen.unshift({
          id: null,
          AdrName: ``,
        })
        return adressen
      },
      { name: `dropdownListAdressen` }
    ),
    apUmsetzungen: computed(
      () => {
        let apUmsetzungen = Array.from(
          store.table.ap_umsetzung_werte.values()
        )
        apUmsetzungen = sortBy(apUmsetzungen, `DomainOrd`)
        return apUmsetzungen.map(el => ({
          value: el.DomainCode,
          label: el.DomainTxt,
        }))
      },
      { name: `dropdownListApUmsetzungen` }
    ),
    apStati: computed(
      () => {
        let apStati = Array.from(
          store.table.ap_bearbstand_werte.values()
        )
        apStati = sortBy(apStati, `DomainOrd`)
        return apStati.map(el => ({
          value: el.DomainCode,
          label: el.DomainTxt,
        }))
      },
      { name: `dropdownListApStati` }
    ),
    artListForAp: computed(
      () => {
        const alreadyUsedApIds = Array.from(store.table.ap.keys()).map(a => Number(a))
        // let user choose store ApArtId
        const apArtIdsNotToShow = alreadyUsedApIds
          .filter(r => r !== store.activeNodes.ap)
        const artList = filter(
          Array.from(store.table.adb_eigenschaften.values()),
          r => !apArtIdsNotToShow.includes(r.TaxonomieId)
        )
        return sortBy(artList, `Artname`)
      },
      { name: `dropdownListArtListForAp` }
    ),
    artnamen: computed(
      () => {
        let artnamen = Array.from(
          store.table.adb_eigenschaften.values()
        )
        artnamen = artnamen.map(a => a.Artname).sort()
        // artnamen.unshift(``)
        return artnamen
      },
      { name: `dropdownListArtnamen` }
    ),
    popEntwicklungWerte: computed(
      () => {
        let popEntwicklungWerte = Array.from(store.table.pop_entwicklung_werte.values())
        popEntwicklungWerte = sortBy(popEntwicklungWerte, `EntwicklungOrd`)
        return popEntwicklungWerte.map(el => ({
          value: el.EntwicklungId,
          label: el.EntwicklungTxt,
        }))
      },
      { name: `dropdownListPopEntwicklungWerte` }
    ),
    tpopEntwicklungWerte: computed(
      () => {
        let tpopEntwicklungWerte = Array.from(
          store.table.tpop_entwicklung_werte.values()
        )
        tpopEntwicklungWerte = sortBy(tpopEntwicklungWerte, `EntwicklungOrd`)
        return tpopEntwicklungWerte.map(el => ({
          value: el.EntwicklungCode,
          label: el.EntwicklungTxt,
        }))
      },
      { name: `dropdownListTpopEntwicklungWerte` }
    ),
    apErfkritWerte: computed(
      () => {
        let apErfkritWerte = Array.from(
          store.table.ap_erfkrit_werte.values()
        )
        apErfkritWerte = sortBy(apErfkritWerte, `BeurteilOrd`)
        return apErfkritWerte.map(el => ({
          value: el.BeurteilId,
          label: el.BeurteilTxt,
        }))
      },
      { name: `dropdownListApErfkritWerte` }
    ),
    tpopmassnErfbeurtWerte: computed(
      () => {
        let tpopmassnErfbeurtWerte = Array.from(store.table.tpopmassn_erfbeurt_werte.values())
        tpopmassnErfbeurtWerte = sortBy(tpopmassnErfbeurtWerte, `BeurteilOrd`)
        return tpopmassnErfbeurtWerte.map(el => ({
          value: el.BeurteilId,
          label: el.BeurteilTxt,
        }))
      },
      { name: `dropdownListTpopmassnErfbeurtWerte` }
    ),
    tpopApBerichtRelevantWerte: computed(
      () => {
        const tpopApBerichtRelevantWerte = Array.from(
          store.table.tpop_apberrelevant_werte.values()
        )
        return tpopApBerichtRelevantWerte.map(t => ({
          value: t.DomainCode,
          label: t.DomainTxt,
        }))
      },
      { name: `dropdownListTpopApBerichtRelevantWerte` }
    ),
    gemeinden: computed(
      () => {
        let gemeinden = Array.from(
          store.table.gemeinde.values()
        )
        gemeinden = sortBy(gemeinden, `GmdName`)
        return gemeinden.map(el => el.GmdName)
      },
      { name: `dropdownListGemeinden` }
    ),
    idbiotopuebereinstWerte: computed(
      () => {
        let idbiotopuebereinstWerte = Array.from(store.table.tpopkontr_idbiotuebereinst_werte.values())
        idbiotopuebereinstWerte = sortBy(idbiotopuebereinstWerte, `DomainOrd`)
        return idbiotopuebereinstWerte.map(el => ({
          value: el.DomainCode,
          label: el.DomainTxt,
        }))
      },
      { name: `dropdownListIdbiotopuebereinstWerte` }
    ),
    lr: computed(
      () => {
        let lr = Array.from(store.table.adb_lr.values())
        // eslint-disable-next-line no-regex-spaces
        return lr.map(e => e.Einheit.replace(/  +/g, ` `))
      },
      { name: `dropdownListLr` }
    ),
    zaehleinheitWerte: computed(
      () => {
        let zaehleinheitWerte = Array.from(
          store.table.tpopkontrzaehl_einheit_werte.values()
        )
        zaehleinheitWerte = sortBy(zaehleinheitWerte, `ZaehleinheitOrd`)
        zaehleinheitWerte = zaehleinheitWerte.map(el => ({
          value: el.ZaehleinheitCode,
          label: el.ZaehleinheitTxt,
        }))
        zaehleinheitWerte.unshift({
          value: null,
          label: ``,
        })
        return zaehleinheitWerte
      },
      { name: `dropdownListZaehleinheitWerte` }
    ),
    methodeWerte: computed(
      () => {
        let methodeWerte = Array.from(
          store.table.tpopkontrzaehl_methode_werte.values()
        )
        methodeWerte = sortBy(methodeWerte, `BeurteilOrd`)
        methodeWerte = methodeWerte.map(el => ({
          value: el.BeurteilCode,
          label: el.BeurteilTxt,
        }))
        return methodeWerte
      },
      { name: `dropdownListMethodeWerte` }
    ),
    tpopMassnTypWerte: computed(
      () => {
        let tpopMassnTypWerte = Array.from(
          store.table.tpopmassn_typ_werte.values()
        )
        tpopMassnTypWerte = sortBy(tpopMassnTypWerte, `MassnTypOrd`)
        return tpopMassnTypWerte.map(el => ({
          value: el.MassnTypCode,
          label: el.MassnTypTxt,
        }))
      },
      { name: `dropdownListTpopMassnTypWerte` }
    ),
    zielTypWerte: computed(
      () => {
        let zielTypWerte = Array.from(
          store.table.ziel_typ_werte.values()
        )
        zielTypWerte = sortBy(zielTypWerte, `ZieltypOrd`)
        return zielTypWerte.map(el => ({
          value: el.ZieltypId,
          label: el.ZieltypTxt,
        }))
      },
      { name: `dropdownListZielTypWerte` }
    ),
  })
}
