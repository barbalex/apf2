import { format } from 'date-fns/format'
import { isValid } from 'date-fns/isValid'
import { isEqual } from 'es-toolkit'

import { queryBeob } from './queryBeob.ts'
import { createPop } from './createPop.ts'
import { createTpop } from './createTpop.ts'
import { updateBeobById } from './updateBeobById.ts'
import {
  store,
  addNotificationAtom,
  navigateAtom,
  setTreeLastTouchedNodeAtom,
  treeOpenNodesAtom,
  treeAddOpenNodesAtom,
  treeActiveNodeArrayAtom,
  type Notification,
  getApolloClientFromStore,
  getTsQueryClientFromStore,
} from '../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const createNewPopFromBeob = async ({
  id,
  apId = '99999999-9999-9999-9999-999999999999',
  projId = '99999999-9999-9999-9999-999999999999',
  search,
}: {
  id: string
  apId?: string | undefined
  projId?: string | undefined
  search: string
}) => {
  const apolloClient = getApolloClientFromStore()
  const tsQueryClient = getTsQueryClientFromStore()
  const navigate = store.get(navigateAtom)
  const openNodes = store.get(treeOpenNodesAtom)
  const activeNodeArray = store.get(treeActiveNodeArrayAtom)

  let beobResult
  try {
    beobResult = await apolloClient.query({
      query: queryBeob,
      variables: { id },
    })
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const beob = beobResult?.data?.beobById
  if (!beob) {
    return addNotification({
      message: 'Die Beobachtung wurde nicht gefunden',
      options: {
        variant: 'error',
      },
    })
  }
  const { geomPoint, datum, data } = beob
  // data is the raw InfoFlora/EVK JSON blob
  const beobData = (data ?? {}) as Record<string, string | null | undefined>
  // new Date(null) coerces to the epoch, like new Date(0)
  const datumDate = new Date(datum ?? 0)
  const datumIsValid = isValid(datumDate)
  const bekanntSeit = datumIsValid ? +format(datumDate, 'yyyy') : null

  const newGeomPoint =
    geomPoint?.geojson ? JSON.parse(String(geomPoint.geojson)) : null

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
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const pop = popResult?.data?.createPop?.pop
  if (!pop) {
    return addNotification({
      message: 'Die neue Population wurde nicht erstellt',
      options: {
        variant: 'error',
      },
    })
  }

  // create new tpop for pop
  let tpopResult
  try {
    tpopResult = await apolloClient.mutate({
      mutation: createTpop,
      variables: {
        popId: pop.id,
        geomPoint: newGeomPoint,
        bekannt_seit: bekanntSeit,
        gemeinde: beobData.NOM_COMMUNE ? beobData.NOM_COMMUNE : null,
        flurname: beobData.DESC_LOCALITE_ ? beobData.DESC_LOCALITE_ : null,
      },
    })
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const tpop = tpopResult?.data?.createTpop?.tpop
  if (!tpop?.popId) {
    return addNotification({
      message: 'Die neue Teil-Population wurde nicht erstellt',
      options: {
        variant: 'error',
      },
    })
  }

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
      message: (error as Error).message,
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

  const newOpenNodes = [
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

  store.set(treeAddOpenNodesAtom, newOpenNodes)
  navigate?.(`/Daten/${newActiveNodeArray.join('/')}${search}`)

  void tsQueryClient.invalidateQueries({
    queryKey: [`KarteBeobNichtZuzuordnenQuery`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`BeobZugeordnetForMapQuery`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`BeobNichtBeurteiltForMapQuery`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`BeobAssignLinesQuery`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeApFolders`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: ['treeAp'],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobZugeordnet`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtZuzuordnen`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtBeurteilt`],
  })
  store.set(setTreeLastTouchedNodeAtom, newActiveNodeArray)

  return
}
