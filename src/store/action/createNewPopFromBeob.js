// @flow
import axios from 'axios'

import apiBaseUrl from '../../modules/apiBaseUrl'
import insertDatasetInIdb from './insertDatasetInIdb'

export default (store: Object, tree: Object, beobId: string) => {
  if (!beobId) {
    return store.listError(new Error(`keine beobId übergeben`))
  }
  const beobBereitgestellt = store.table.beob_bereitgestellt.get(beobId)
  if (!beobBereitgestellt) {
    return store.listError(
      new Error(`Die Beobachtung mit beobId ${beobId} wurde nicht gefunden`)
    )
  }
  let beob
  let x
  let y
  let tpop
  if (beobBereitgestellt.QuelleId === 1) {
    beob = store.table.beob_evab.get(beobId)
    if (!beob) {
      return store.listError(
        new Error(`Die EvAB-Beobachtung mit beobId ${beobId} wurde nicht gefunden`)
      )
    }
    x = beob.COORDONNEE_FED_E
    y = beob.COORDONNEE_FED_N
  } else {
    beob = store.table.beob_infospezies.get(beobId)
    if (!beob) {
      return store.listError(
        new Error(`Die Infospezies-Beobachtung mit beobId ${beobId} wurde nicht gefunden`)
      )
    }
    x = beob.FNS_XGIS
    y = beob.FNS_YGIS
  }
  const { ap, projekt } = tree.activeNodes
  const user = store.user.name
  // create new pop for ap
  axios.post(`${apiBaseUrl}/insert/apflora/tabelle=pop/feld=ApArtId/wert=${ap}/user=${user}`)
    .then(({ data: popId }) => {
      // give pop koords of beob
      const felder = {
        id: popId,
        user: user,
        PopXKoord: x,
        PopYKoord: y,
      }
      return axios.put(`${apiBaseUrl}/updateMultiple/apflora/tabelle=pop/felder=${JSON.stringify(felder)}`)
    })
    .then(({ data }) => {
      const pop = data[0]
      if (!pop) {
        throw new Error(`Fehler bei der Erstellung einer neuen Population`)
      }
      store.table.pop.set(pop.PopId, pop)
      insertDatasetInIdb(store, `pop`, pop)
      // create new tpop for pop
      return axios.post(`${apiBaseUrl}/insert/apflora/tabelle=tpop/feld=PopId/wert=${pop.PopId}/user=${user}`)
    })
    .then(({ data: tpopId }) => {
      // give tpop koords of beob
      const felder = {
        id: tpopId,
        user: user,
        TPopXKoord: x,
        TPopYKoord: y,
      }
      return axios.put(`${apiBaseUrl}/updateMultiple/apflora/tabelle=tpop/felder=${JSON.stringify(felder)}`)
    })
    .then(({ data }) => {
      tpop = data[0]
      if (!tpop) {
        throw new Error(`Fehler bei der Erstellung einer neuen Teil-Population`)
      }
      console.log(`tpop:`, tpop)
      store.table.tpop.set(tpop.TPopId, tpop)
      insertDatasetInIdb(store, `tpop`, tpop)
      // create new beobzuordnung
      return axios.post(`${apiBaseUrl}/apflora/beobzuordnung/NO_NOTE/${beobId}`)
    })
    .then(({ data: row }) => {
      // insert this dataset in idb
      insertDatasetInIdb(store, `beobzuordnung`, row)
      // insert this dataset in store.table
      store.table.beobzuordnung.set(row.NO_NOTE, row)
      // set new activeNodeArray
      const newActiveNodeArray = [
        `Projekte`,
        projekt,
        `Arten`,
        ap,
        `Populationen`,
        tpop.PopId,
        `Teil-Populationen`,
        tpop.TPopId,
        `Beobachtungen`,
        beobId
      ]
      tree.setActiveNodeArray(newActiveNodeArray)
      store.updateProperty(tree, `TPopId`, tpop.TPopId)
      store.updatePropertyInDb(tree, `TPopId`, tpop.TPopId)
      store.updateProperty(tree, `NO_ISFS`, beobBereitgestellt.NO_ISFS)
      store.updatePropertyInDb(tree, `NO_ISFS`, beobBereitgestellt.NO_ISFS)
      store.updateProperty(tree, `QuelleId`, beobBereitgestellt.QuelleId)
      store.updatePropertyInDb(tree, `QuelleId`, beobBereitgestellt.QuelleId)
    })
    .catch((error) =>
      store.listError(error)
    )
}
