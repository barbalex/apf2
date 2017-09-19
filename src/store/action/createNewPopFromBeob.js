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
  let popResult
  try {
    popResult = await axios.post(`/pop`, {
      ApArtId: ap,
      user: user,
      // give pop koords of beob
      PopXKoord: X,
      PopYKoord: Y,
    })
  } catch (error) {
    store.listError(error)
  }
  if (!popResult || !popResult.data || !popResult.data[0]) {
    throw new Error(`Fehler bei der Erstellung einer neuen Population`)
  }
  const pop = popResult.data[0]
  store.table.pop.set(pop.PopId, pop)

  // create new tpop for pop
  let tpopResult
  try {
    tpopResult = await axios.post('/tpop', {
      PopId: pop.PopId,
      user: user,
      // give tpop koords of beob
      TPopXKoord: X,
      TPopYKoord: Y,
    })
  } catch (error) {
    store.listError(error)
  }
  if (
    !tpopResult ||
    !tpopResult.data ||
    !tpopResult.data ||
    !tpopResult.data[0]
  ) {
    throw new Error(`Fehler bei der Erstellung einer neuen Teilpopulation`)
  }
  tpop = tpopResult.data[0]
  store.table.tpop.set(tpop.TPopId, tpop)

  // create new beobzuordnung
  let beobzuordnungResult
  try {
    beobzuordnungResult = await axios.post('beobzuordnung', { BeobId: beobId })
  } catch (error) {
    store.listError(error)
  }
  if (
    !beobzuordnungResult ||
    !beobzuordnungResult.data ||
    !beobzuordnungResult.data[0]
  ) {
    throw new Error(
      `Fehler bei der Erstellung der neuen Beobachtungs-Zuordnung`
    )
  }
  const beobzuordnung = beobzuordnungResult.data[0]

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
