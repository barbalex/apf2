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

  // create new pop for ap
  let popResult
  try {
    popResult = await axios({
      method: 'POST',
      url: `/pop`,
      data: {
        ApArtId: ap,
        // give pop koords of beob
        PopXKoord: X,
        PopYKoord: Y,
      },
      headers: {
        Prefer: 'return=representation',
      },
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
    tpopResult = await axios({
      method: 'POST',
      url: '/tpop',
      data: {
        PopId: pop.PopId,
        // give tpop koords of beob
        TPopXKoord: X,
        TPopYKoord: Y,
      },
      headers: {
        Prefer: 'return=representation',
      },
    })
  } catch (error) {
    store.listError(error)
  }
  if (!tpopResult || !tpopResult.data || !tpopResult.data[0]) {
    throw new Error(`Fehler bei der Erstellung einer neuen Teilpopulation`)
  }
  tpop = tpopResult.data[0]
  store.table.tpop.set(tpop.TPopId, tpop)

  // create new beobzuordnung
  let beobzuordnungResult

  try {
    // first check if beobzuordnung already exists
    beobzuordnungResult = await axios.get(`/beobzuordnung?BeobId=eq.${beobId}`)
  } catch (error) {
    store.listError(error)
  }
  if (
    beobzuordnungResult &&
    beobzuordnungResult.data &&
    beobzuordnungResult.data[0]
  ) {
    try {
      beobzuordnungResult = await axios.patch(
        `/beobzuordnung?BeobId=eq.${beobId}`,
        {
          TPopId: tpop.TPopId,
        }
      )
    } catch (error) {
      store.listError(error)
    }
  } else {
    try {
      beobzuordnungResult = await axios({
        method: 'POST',
        url: '/beobzuordnung',
        data: { BeobId: beobId, TPopId: tpop.TPopId },
        headers: {
          Prefer: 'return=representation',
        },
      })
    } catch (error) {
      store.listError(error)
    }
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
  //store.table.beobzuordnung.set(beobzuordnung.id, beobzuordnung)
  store.table.beobzuordnung.set(beobzuordnung.BeobId, beobzuordnung)

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
  tree.setOpenNodesFromActiveNodeArray()
}
