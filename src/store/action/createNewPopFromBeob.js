// @flow
import axios from 'axios'
import format from 'date-fns/format'

export default async ({
  store,
  tree,
  beobId,
}: {
  store: Object,
  tree: Object,
  beobId: string,
}): Promise<void> => {
  const beob = store.table.beob.get(beobId)
  if (!beob) {
    return store.listError(
      new Error(`Die Beobachtung mit beobId ${beobId} wurde nicht gefunden`)
    )
  }
  const { X, Y, Datum, data } = beob
  let tpop
  const { ap, projekt } = tree.activeNodes

  // create new pop for ap
  let popResult
  try {
    popResult = await axios({
      method: 'POST',
      url: '/pop',
      data: {
        ApArtId: ap,
        // give pop some data of beob
        PopXKoord: X,
        PopYKoord: Y,
        PopBekanntSeit: format(new Date(Datum), 'YYYY'),
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
        // give tpop some data of beob
        TPopXKoord: X,
        TPopYKoord: Y,
        TPopBekanntSeit: format(new Date(Datum), 'YYYY'),
        TPopGemeinde: data.NOM_COMMUNE ? data.NOM_COMMUNE : null,
        TPopFlurname: data.DESC_LOCALITE_ ? data.DESC_LOCALITE_ : null,
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

  // create new tpopbeob
  let beobzuordnungResult

  try {
    // first check if tpopbeob already exists
    beobzuordnungResult = await axios.get(`/tpopbeob?BeobId=eq.${beobId}`)
  } catch (error) {
    store.listError(error)
  }
  if (
    beobzuordnungResult &&
    beobzuordnungResult.data &&
    beobzuordnungResult.data[0]
  ) {
    try {
      beobzuordnungResult = await axios.patch(`/tpopbeob?BeobId=eq.${beobId}`, {
        TPopId: tpop.TPopId,
      })
    } catch (error) {
      store.listError(error)
    }
  } else {
    try {
      beobzuordnungResult = await axios({
        method: 'POST',
        url: '/tpopbeob',
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
  const tpopbeob = beobzuordnungResult.data[0]

  // insert this dataset in store.table
  //store.table.tpopbeob.set(tpopbeob.id, tpopbeob)
  store.table.tpopbeob.set(tpopbeob.BeobId, tpopbeob)

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
