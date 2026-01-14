import { format } from 'date-fns/format'
import { isValid } from 'date-fns/isValid'
import { isEqual } from 'date-fns/isEqual'

import { queryBeob } from './queryBeob.ts'
import { createPop } from './createPop.ts'
import { createTpop } from './createTpop.ts'
import { updateBeobById } from './updateBeobById.ts'

export const createNewPopFromBeob = async ({
  id,
  apId = '99999999-9999-9999-9999-999999999999',
  projId = '99999999-9999-9999-9999-999999999999',
  apolloClient,
  store,
  search,
}) => {
  const { enqueNotification } = store
  const tree = store.tree
  const { addOpenNodes } = tree

  let beobResult
  try {
    beobResult = await apolloClient.query({
      query: queryBeob,
      variables: { id },
    })
  } catch (error) {
    return enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const beob = beobResult?.data?.beobById
  const { geomPoint, datum, data } = beob
  const datumIsValid = isValid(new Date(datum))
  const bekanntSeit = datumIsValid ? +format(new Date(datum), 'yyyy') : null

  const newGeomPoint =
    geomPoint?.geojson ? JSON.parse(geomPoint?.geojson) : null

  // create new pop for ap
  let popResult
  try {
    popResult = await apolloClient.mutate({
      mutation: createPop,
      variables: {
        apId,
        geomPoint: newGeomPoint,
        bekanntSeit,
      },
    })
  } catch (error) {
    return enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const pop = popResult?.data?.createPop?.pop

  // create new tpop for pop
  let tpopResult
  try {
    tpopResult = await apolloClient.mutate({
      mutation: createTpop,
      variables: {
        popId: pop.id,
        geomPoint: newGeomPoint,
        bekannt_seit: bekanntSeit,
        gemeinde: data.NOM_COMMUNE ? data.NOM_COMMUNE : null,
        flurname: data.DESC_LOCALITE_ ? data.DESC_LOCALITE_ : null,
      },
    })
  } catch (error) {
    return enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const tpop = tpopResult?.data?.createTpop?.tpop

  try {
    await apolloClient.mutate({
      mutation: updateBeobById,
      variables: {
        id,
        tpopId: tpop.id,
      },
    })
  } catch (error) {
    return enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }

  // set new activeNodeArray
  const newActiveNodeArray = [
    `Projekte`,
    projId,
    `Arten`,
    apId,
    `Populationen`,
    tpop.popId,
    `Teil-Populationen`,
    tpop.id,
    `Beobachtungen`,
    id,
  ]

  let newOpenNodes = [
    ...tree.openNodes,
    // add Beob and it's not yet existing parents to open nodes
    [`Projekte`, projId, `Arten`, apId, `Populationen`],
    [`Projekte`, projId, `Arten`, apId, `Populationen`, tpop.popId],
    [
      `Projekte`,
      projId,
      `Arten`,
      apId,
      `Populationen`,
      tpop.popId,
      `Teil-Populationen`,
    ],
    [
      `Projekte`,
      projId,
      `Arten`,
      apId,
      `Populationen`,
      tpop.popId,
      `Teil-Populationen`,
      tpop.id,
    ],
    [
      `Projekte`,
      projId,
      `Arten`,
      apId,
      `Populationen`,
      tpop.popId,
      `Teil-Populationen`,
      tpop.id,
      `Beobachtungen`,
    ],
    [
      `Projekte`,
      projId,
      `Arten`,
      apId,
      `Populationen`,
      tpop.popId,
      `Teil-Populationen`,
      tpop.id,
      `Beobachtungen`,
      id,
    ],
  ]
    // and remove old node
    .filter((n) => !isEqual(n, tree.activeNodeArray))

  addOpenNodes(newOpenNodes)
  store.navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)

  store.tsQueryClient.invalidateQueries({
    queryKey: [`KarteBeobNichtZuzuordnenQuery`],
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: [`BeobZugeordnetForMapQuery`],
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: [`BeobNichtBeurteiltForMapQuery`],
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: [`BeobAssignLinesQuery`],
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: [`treeApFolders`],
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: ['treeAp'],
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobZugeordnet`],
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtZuzuordnen`],
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtBeurteilt`],
  })
  store.tree.setLastTouchedNode(newActiveNodeArray)

  return
}
