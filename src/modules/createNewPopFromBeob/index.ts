import { format } from 'date-fns/format'
import { isValid } from 'date-fns/isValid'
import { isEqual } from 'date-fns/isEqual'

import { queryBeob } from './queryBeob.ts'
import { createPop } from './createPop.ts'
import { createTpop } from './createTpop.ts'
import { updateBeobById } from './updateBeobById.ts'
import {
  store as jotaiStore,
  apolloClientAtom,
  tsQueryClientAtom,
  addNotificationAtom,
  navigateAtom,
  setTreeLastTouchedNodeAtom,
  treeOpenNodesAtom,
  treeAddOpenNodesAtom,
  treeActiveNodeArrayAtom,
} from '../../store/index.ts'

const addNotification = (notification) =>
  jotaiStore.set(addNotificationAtom, notification)

export const createNewPopFromBeob = async ({
  id,
  apId = '99999999-9999-9999-9999-999999999999',
  projId = '99999999-9999-9999-9999-999999999999',
  search,
}) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)
  const tsQueryClient = jotaiStore.get(tsQueryClientAtom)
  const navigate = jotaiStore.get(navigateAtom)
  const openNodes = jotaiStore.get(treeOpenNodesAtom)
  const activeNodeArray = jotaiStore.get(treeActiveNodeArrayAtom)

  let beobResult
  try {
    beobResult = await apolloClient.query({
      query: queryBeob,
      variables: { id },
    })
  } catch (error) {
    return addNotification({
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
    return addNotification({
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
    return addNotification({
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
    return addNotification({
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
    ...openNodes,
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
    .filter((n) => !isEqual(n, activeNodeArray))

  jotaiStore.set(treeAddOpenNodesAtom, newOpenNodes)
  navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)

  tsQueryClient.invalidateQueries({
    queryKey: [`KarteBeobNichtZuzuordnenQuery`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`BeobZugeordnetForMapQuery`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`BeobNichtBeurteiltForMapQuery`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`BeobAssignLinesQuery`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`treeApFolders`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: ['treeAp'],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobZugeordnet`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtZuzuordnen`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtBeurteilt`],
  })
  jotaiStore.set(setTreeLastTouchedNodeAtom, newActiveNodeArray)

  return
}
