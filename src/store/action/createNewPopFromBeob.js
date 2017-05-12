// @flow
import axios from 'axios'

import apiBaseUrl from '../../modules/apiBaseUrl'
import insertDatasetInIdb from './insertDatasetInIdb'

export default (store: Object, tree: Object, beobId: string): void => {
  if (!beobId) {
    return store.listError(new Error(`keine beobId übergeben`))
  }
  const beob = store.table.beob.get(beobId)
  if (!beob) {
    return store.listError(
      new Error(`Die Beobachtung mit beobId ${beobId} wurde nicht gefunden`),
    )
  }
  const { X, Y } = beob
  let tpop
  const { ap, projekt } = tree.activeNodes
  const user = store.user.name
  // create new pop for ap
  axios
    .post(
      `${apiBaseUrl}/insert/apflora/tabelle=pop/feld=ApArtId/wert=${ap}/user=${user}`,
    )
    .then(({ data: popId }) => {
      // give pop koords of beob
      const felder = {
        id: popId,
        user: user,
        PopXKoord: X,
        PopYKoord: Y,
      }
      return axios.put(
        `${apiBaseUrl}/updateMultiple/apflora/tabelle=pop/felder=${JSON.stringify(felder)}`,
      )
    })
    .then(({ data }) => {
      const pop = data[0]
      if (!pop) {
        throw new Error(`Fehler bei der Erstellung einer neuen Population`)
      }
      store.table.pop.set(pop.PopId, pop)
      insertDatasetInIdb(store, `pop`, pop)
      // create new tpop for pop
      return axios.post(
        `${apiBaseUrl}/insert/apflora/tabelle=tpop/feld=PopId/wert=${pop.PopId}/user=${user}`,
      )
    })
    .then(({ data: tpopId }) => {
      // give tpop koords of beob
      const felder = {
        id: tpopId,
        user: user,
        TPopXKoord: X,
        TPopYKoord: Y,
      }
      return axios.put(
        `${apiBaseUrl}/updateMultiple/apflora/tabelle=tpop/felder=${JSON.stringify(felder)}`,
      )
    })
    .then(({ data }) => {
      tpop = data[0]
      if (!tpop) {
        throw new Error(`Fehler bei der Erstellung einer neuen Teil-Population`)
      }
      store.table.tpop.set(tpop.TPopId, tpop)
      insertDatasetInIdb(store, `tpop`, tpop)
      // create new beobzuordnung
      return axios.post(`${apiBaseUrl}/apflora/beobzuordnung/BeobId/${beobId}`)
    })
    .then(({ data: row }) => {
      // insert this dataset in idb
      insertDatasetInIdb(store, `beobzuordnung`, row)
      // insert this dataset in store.table
      store.table.beobzuordnung.set(row.BeobId, row)
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
        beobId,
      ]
      // TODO: new url is set but ui does not reflect it
      tree.setActiveNodeArray(newActiveNodeArray)
      store.updateProperty(tree, `TPopId`, tpop.TPopId)
      store.updatePropertyInDb(tree, `TPopId`, tpop.TPopId)
      store.updateProperty(tree, `BeobId`, beobId)
      store.updatePropertyInDb(tree, `BeobId`, beobId)
      store.updateProperty(tree, `QuelleId`, beob.QuelleId)
      store.updatePropertyInDb(tree, `QuelleId`, beob.QuelleId)
      tree.setOpenNodesFromActiveNodeArray()
    })
    .catch(error => store.listError(error))
}
