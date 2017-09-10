// @flow
import axios from 'axios'

export default async (
  store: Object,
  tree: Object,
  beobId: string
): Promise<void> => {
  if (!beobId) {
    return store.listError(new Error('keine beobId übergeben'))
  }
  const beob = store.table.beob.get(beobId)
  if (!beob) {
    return store.listError(
      new Error(`Die Beobachtung mit beobId ${beobId} wurde nicht gefunden`)
    )
  }
  const { X, Y } = beob
  let tpop
  const { ap, projekt } = tree.activeNodes
  const user = store.user.name
  // create new pop for ap
  let popId
  try {
    popId = await axios.post(
      `/insert/apflora/tabelle=pop/feld=ApArtId/wert=${ap}/user=${user}`
    )
  } catch (error) {
    store.listError(error)
  }
  // give pop koords of beob
  const popFelder = {
    id: popId,
    user: user,
    PopXKoord: X,
    PopYKoord: Y,
  }
  let popData
  try {
    popData = await axios.put(
      `/updateMultiple/apflora/tabelle=pop/felder=${JSON.stringify(popFelder)}`
    )
  } catch (error) {
    store.listError(error)
  }
  const pop = popData[0]
  if (!pop) {
    throw new Error(`Fehler bei der Erstellung einer neuen Population`)
  }
  store.table.pop.set(pop.PopId, pop)
  // create new tpop for pop
  try {
  } catch (error) {
    store.listError(error)
  }
  let tpopId
  try {
    tpopId = await axios.post(
      `/insert/apflora/tabelle=tpop/feld=PopId/wert=${pop.PopId}/user=${user}`
    )
  } catch (error) {
    store.listError(error)
  }
  // give tpop koords of beob
  const felder = {
    id: tpopId,
    user: user,
    TPopXKoord: X,
    TPopYKoord: Y,
  }
  let tpopData
  try {
    tpopData = await axios.put(
      `/updateMultiple/apflora/tabelle=tpop/felder=${JSON.stringify(felder)}`
    )
  } catch (error) {
    store.listError(error)
  }
  tpop = tpopData[0]
  if (!tpop) {
    throw new Error(`Fehler bei der Erstellung einer neuen Teil-Population`)
  }
  store.table.tpop.set(tpop.TPopId, tpop)
  // create new beobzuordnung
  let row
  try {
    row = await axios.post(`/apflora/beobzuordnung/BeobId/${beobId}`)
  } catch (error) {
    store.listError(error)
  }
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
  tree.setOpenNodesFromActiveNodeArray()
}
