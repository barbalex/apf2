// @flow
import axios from 'axios'

export default async ({
  store,
  tree,
  beobId,
}: {
  store: Object,
  tree: Object,
  beobId: string,
}): Promise<void> => {
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
  let popIdResult
  try {
    popIdResult = await axios.post(
      `/insert/apflora/tabelle=pop/feld=ApArtId/wert=${ap}/user=${user}`
    )
  } catch (error) {
    store.listError(error)
  }
  if (!popIdResult || !popIdResult.data) {
    throw new Error(`Fehler bei der Erstellung einer neuen Population`)
  }
  const popId = popIdResult.data

  // give pop koords of beob
  const popFelder = {
    id: popId,
    user: user,
    PopXKoord: X,
    PopYKoord: Y,
  }
  let popResult
  try {
    popResult = await axios.put(
      `/updateMultiple/apflora/tabelle=pop/felder=${JSON.stringify(popFelder)}`
    )
  } catch (error) {
    store.listError(error)
  }
  if (!popResult || !popResult.data || !popResult.data[0]) {
    throw new Error(`Fehler bei der Erstellung einer neuen Population`)
  }
  const pop = popResult.data[0]
  store.table.pop.set(pop.PopId, pop)

  // create new tpop for pop
  let tpopIdResult
  try {
    tpopIdResult = await axios.post(
      `/insert/apflora/tabelle=tpop/feld=PopId/wert=${pop.PopId}/user=${user}`
    )
  } catch (error) {
    store.listError(error)
  }
  if (!tpopIdResult || !tpopIdResult.data) {
    throw new Error(`Fehler bei der Erstellung einer neuen Teilpopulation`)
  }
  const tpopId = tpopIdResult.data

  // give tpop koords of beob
  const felder = {
    id: tpopId,
    user: user,
    TPopXKoord: X,
    TPopYKoord: Y,
  }
  let tpopResult
  try {
    tpopResult = await axios.put(
      `/updateMultiple/apflora/tabelle=tpop/felder=${JSON.stringify(felder)}`
    )
  } catch (error) {
    store.listError(error)
  }
  if (!tpopResult || !tpopResult.data) {
    throw new Error(`Fehler bei der Aktualisierung der neuen Teil-Population`)
  }
  tpop = tpopResult.data[0]
  store.table.tpop.set(tpop.TPopId, tpop)

  // create new beobzuordnung
  let beobzuordnungResult
  try {
    beobzuordnungResult = await axios.post(
      `/apflora/beobzuordnung/BeobId/${beobId}`
    )
  } catch (error) {
    store.listError(error)
  }
  if (!beobzuordnungResult || !beobzuordnungResult.data) {
    throw new Error(
      `Fehler bei der Erstellung der neuen Beobachtungs-Zuordnung`
    )
  }
  const beobzuordnung = beobzuordnungResult.data

  // insert this dataset in store.table
  store.table.beobzuordnung.set(beobzuordnung.id, beobzuordnung)

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

  tree.setActiveNodeArray(newActiveNodeArray)
  store.updateProperty(tree, `TPopId`, tpop.TPopId)
  store.updatePropertyInDb(tree, `TPopId`, tpop.TPopId)
  store.updateProperty(tree, `BeobId`, beobId)
  store.updatePropertyInDb(tree, `BeobId`, beobId)
  tree.setOpenNodesFromActiveNodeArray()
}
