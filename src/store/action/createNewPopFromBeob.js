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
  const { x, y, datum, data } = beob
  let tpop
  const { ap, projekt } = tree.activeNodes

  // create new pop for ap
  let popResult
  try {
    popResult = await axios({
      method: 'POST',
      url: '/pop',
      data: {
        ap_id: ap,
        // give pop some data of beob
        x,
        y,
        bekannt_seit: format(new Date(datum), 'YYYY'),
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
  store.table.pop.set(pop.id, pop)

  // create new tpop for pop
  let tpopResult
  try {
    tpopResult = await axios({
      method: 'POST',
      url: '/tpop',
      data: {
        pop_id: pop.id,
        // give tpop some data of beob
        x,
        y,
        bekannt_seit: format(new Date(datum), 'YYYY'),
        gemeinde: data.NOM_COMMUNE ? data.NOM_COMMUNE : null,
        flurname: data.DESC_LOCALITE_ ? data.DESC_LOCALITE_ : null,
      },
      headers: {
        Prefer: 'return=representation',
      },
    })
  } catch (error) {
    return store.listError(error)
  }
  if (!tpopResult || !tpopResult.data || !tpopResult.data[0]) {
    throw new Error(`Fehler bei der Erstellung einer neuen Teilpopulation`)
  }
  tpop = tpopResult.data[0]
  store.table.tpop.set(tpop.id, tpop)

  try {
    await axios.patch(`/beob?beob_id=eq.${beobId}`, {
      tpop_id: tpop.id,
    })
  } catch (error) {
    return store.listError(error)
  }

  // insert this dataset in store.table
  store.table.beob.set(beob.beob_id, beob)

  // set new activeNodeArray
  const newActiveNodeArray = [
    `Projekte`,
    projekt,
    `Arten`,
    ap,
    `Populationen`,
    tpop.pop_id,
    `Teil-Populationen`,
    tpop.id,
    `Beobachtungen`,
    beobId,
  ]

  tree.setActiveNodeArray(newActiveNodeArray)
  tree.setOpenNodesFromActiveNodeArray()
}
