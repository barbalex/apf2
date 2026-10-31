import { apiFetch, apiInsert, apiUpdateByVariables } from './api.ts'
import { v7 as uuidv7 } from 'uuid'
import { format } from 'date-fns/format'
import { isValid } from 'date-fns/isValid'
import { isEqual } from 'es-toolkit'

import {
  store,
  addNotificationAtom,
  navigateAtom,
  setTreeLastTouchedNodeAtom,
  treeOpenNodesAtom,
  treeAddOpenNodesAtom,
  treeActiveNodeArrayAtom,
  type Notification,
  getTsQueryClientFromStore,
} from '../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const createNewTpopFromBeob = async ({
  pop,
  beobId,
  projId = '99999999-9999-9999-9999-999999999999',
  apId = '99999999-9999-9999-9999-999999999999',
  search,
}: {
  pop: { id: string }
  beobId: string
  projId?: string | undefined
  apId?: string | undefined
  search: string
}) => {
  const tsQueryClient = getTsQueryClientFromStore()
  const navigate = store.get(navigateAtom)
  const openNodes = store.get(treeOpenNodesAtom)
  const activeNodeArray = store.get(treeActiveNodeArrayAtom)
  let beob:
    | {
        datum: string | null
        data: Record<string, string | null | undefined> | null
        geom_point: { coordinates: number[] } | null
      }
    | undefined
  try {
    const beobs = await apiFetch<
      {
        datum: string | null
        data: Record<string, string | null | undefined> | null
        geom_point: { coordinates: number[] } | null
      }[]
    >(`/q_beob?id=eq.${beobId}&select=datum,data,geom_point`)
    beob = beobs?.[0]
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const { datum, data } = beob ?? {}
  // data is the raw InfoFlora/EVK JSON blob
  const beobData = (data ?? {}) as Record<string, string | null | undefined>
  // new Date(null) coerces to the epoch, like new Date(0)
  const datumDate = new Date(datum ?? 0)
  const datumIsValid = isValid(datumDate)
  const bekanntSeit = datumIsValid ? +format(datumDate, 'yyyy') : null
  // geom_point arrives as GeoJSON (former geomPoint.geojson parse)
  const geomPoint = beob?.geom_point ?? null

  // create new tpop for pop
  const newTpopId = uuidv7()
  try {
    await apiInsert('tpop', {
      id: newTpopId,
      pop_id: pop.id,
      geom_point: geomPoint,
      bekannt_seit: bekanntSeit,
      gemeinde: beobData.NOM_COMMUNE ? beobData.NOM_COMMUNE : null,
      flurname: beobData.DESC_LOCALITE_ ? beobData.DESC_LOCALITE_ : null,
    })
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }

  try {
    await apiUpdateByVariables('beob', {
      id: beobId,
      tpopId: newTpopId,
      nichtZuordnen: false,
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
    pop.id,
    `Teil-Populationen`,
    newTpopId,
    `Beobachtungen`,
    beobId,
  ]

  const newOpenNodes = [
    ...openNodes,
    // add Beob and it's not yet existing parents to open nodes
    [`Projekte`, projId, `Arten`, apId, `Populationen`],
    [`Projekte`, projId, `Arten`, apId, `Populationen`, pop.id],
    [
      `Projekte`,
      projId,
      `Arten`,
      apId,
      `Populationen`,
      pop.id,
      `Teil-Populationen`,
    ],
    [
      `Projekte`,
      projId,
      `Arten`,
      apId,
      `Populationen`,
      pop.id,
      `Teil-Populationen`,
      newTpopId,
    ],
    [
      `Projekte`,
      projId,
      `Arten`,
      apId,
      `Populationen`,
      pop.id,
      `Teil-Populationen`,
      newTpopId,
      `Beobachtungen`,
    ],
    [
      `Projekte`,
      projId,
      `Arten`,
      apId,
      `Populationen`,
      pop.id,
      `Teil-Populationen`,
      newTpopId,
      `Beobachtungen`,
      beobId,
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
    queryKey: [`treeBeobZugeordnet`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtZuzuordnen`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeBeobNichtBeurteilt`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeAp`],
  })
  store.set(setTreeLastTouchedNodeAtom, newActiveNodeArray)
}
