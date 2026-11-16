import { apiInsert } from '../../../modules/api.ts'
import { v7 as uuidv7 } from 'uuid'
import { upperFirst } from 'es-toolkit'

import { tables } from '../../../modules/tables.ts'
import {
  tsQueryClientAtom,
  addNotificationAtom,
  navigateAtom,
  userNameAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
  type Notification,
} from '../../../store/index.ts'
import type { Store } from 'jotai'

const addNotification = (
  store: Store,
  notification: Omit<Notification, 'key'>,
) => store.set(addNotificationAtom, notification)

export const insertDataset = async ({
  store,
  tablePassed,
  parentId,
  menuType,
  singleElementUrlName: singleElementName,
  url,
  search,
  jahr: jahrPassed,
}: {
  store: Store
  tablePassed: string
  parentId?: string | null | undefined
  menuType: string
  singleElementUrlName?: string | null | undefined
  url: (string | number)[]
  search: string
  jahr?: string | null | undefined
}) => {
  const tsQueryClient = store.get(tsQueryClientAtom)
  if (!tsQueryClient) {
    return addNotification(store, {
      message: 'no query client found in store',
      options: {
        variant: 'error',
      },
    })
  }
  const navigate = store.get(navigateAtom)
  const openNodes = store.get(treeOpenNodesAtom)
  let table = tablePassed
  // insert new dataset in db and fetch id
  const tableMetadata = tables.find((t) => t.table === table)
  const parentTable = tableMetadata?.parentTable
  if (!tableMetadata) {
    return addNotification(store, {
      message: `no table meta data found for table "${table}"`,
      options: {
        variant: 'error',
      },
    })
  }
  // some tables need to be translated, i.e. tpopfreiwkontr
  if (tableMetadata.dbTable) {
    table = tableMetadata.dbTable
  }
  const idField = tableMetadata.idField
  if (!idField) {
    return addNotification(store, {
      message: 'new dataset not created as no idField could be found',
      options: {
        variant: 'error',
      },
    })
  }
  // build the new row; all the former per-menuType mutations differ
  // only in which columns they set
  const newId = uuidv7()
  const row: Record<string, unknown> = { id: newId }
  const withoutParent =
    ['userFolder', 'user', 'adresseFolder', 'adresse'].includes(menuType) ||
    menuType.includes('Werte')
  if (!withoutParent && parentId && tableMetadata.parentIdField) {
    row[tableMetadata.parentIdField] = parentId
  }
  if (menuType === 'zieljahrFolder') {
    row.jahr = Number(jahrPassed)
  }
  if (menuType === 'tpopfreiwkontrFolder') {
    row.typ = 'Freiwilligen-Kontrolle'
  }
  if (['tpopfeldkontrFolder', 'tpopfeldkontr'].includes(menuType)) {
    row.typ = 'Kontrolle'
  }
  if (['userFolder', 'user'].includes(menuType)) {
    row.role = 'apflora_ap_reader'
  }
  if (menuType.includes('Werte')) {
    row.changed_by = store.get(userNameAtom)
  }

  try {
    await apiInsert(table, row)
  } catch (error) {
    return addNotification(store, {
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const rowId = newId
  // set new url
  const newActiveNodeArray = [...url, rowId]
  // need to add single name to the url, i.e. 'Art' for ap
  const to = `/Daten/${newActiveNodeArray.join('/')}${singleElementName ? `/${singleElementName}` : ''}${search}`
  setTimeout(() => navigate?.(to), 300)
  // set open nodes
  let newOpenNodes = [...openNodes, newActiveNodeArray]
  if (['zielFolder', 'zieljahrFolder'].includes(menuType)) {
    const urlWithoutJahr = url.toSpliced(-1)
    newOpenNodes = [...openNodes, urlWithoutJahr, newActiveNodeArray]
  }
  if (['tpopfeldkontr', 'tpopfeldkontrFolder'].includes(menuType)) {
    // 1. add new zaehlung
    const zaehlId = uuidv7()
    await apiInsert('tpopkontrzaehl', {
      id: zaehlId,
      tpopkontr_id: rowId,
    })
    // 2. open the zaehlungFolder
    const newOpenFolder = [...newActiveNodeArray, 'Zaehlungen']
    const newOpenNode = [...newActiveNodeArray, 'Zaehlungen', zaehlId]
    newOpenNodes = [...newOpenNodes, newOpenFolder, newOpenNode]
  }
  store.set(treeSetOpenNodesAtom, newOpenNodes)
  // console.log('insertDataset', { table, parentTable })
  // invalidate tree queries for count and data
  if (['user', 'message', 'currentissue'].includes(table)) {
    void tsQueryClient.invalidateQueries({ queryKey: ['treeRoot'] })
  }
  const queryKeyTable =
    parentTable === 'tpopfeldkontr' ? 'treeTpopfeldkontrzaehl'
    : parentTable === 'tpopfreiwkontr' ? 'treeTpopfreiwkontrzaehl'
    : menuType.includes('tpopfeldkontr') ? 'treeTpopfeldkontr'
    : menuType.includes('tpopfreiwkontr') ? 'treeTpopfreiwkontr'
    : table === 'tpop_apberrelevant_grund_werte' ?
      'treeTpopApberrelevantGrundWerte'
    : table === 'ek_abrechnungstyp_werte' ? 'treeEkAbrechnungstypWerte'
    : table === 'tpopkontrzaehl_einheit_werte' ? 'treePopkontrzaehlEinheitWerte'
    : `tree${upperFirst(table)}`
  void tsQueryClient.invalidateQueries({
    queryKey: [queryKeyTable],
  })
  // console.log('insertDataset', {
  //   table,
  //   parentTable,
  //   menuType,
  //   queryKeyTable,
  // })
  // folder labels and counts live in the list queries themselves —
  // only these two tables have folder queries of their own
  if (['apberuebersicht'].includes(table)) {
    void tsQueryClient.invalidateQueries({ queryKey: ['treeRoot'] })
  }
  if (table === 'ziel') {
    void tsQueryClient.invalidateQueries({ queryKey: ['treeZiel'] })
  }
  // ap-level lists and counts live in the per-ap tree queries — each of
  // them fires ~10 requests, so refetching them for every insert anywhere
  // storms the api (#837). Only inserts that can change them count:
  // a new ap changes the projekt's ap list, children of an ap (pop, ziel,
  // erfkrit, …) change that ap's folder counts.
  const apChildTables = [
    'pop',
    'ziel',
    'erfkrit',
    'apber',
    'idealbiotop',
    'assozart',
    'ekzaehleinheit',
    'ekfrequenz',
    'apart',
    'beobNichtZuzuordnen',
    'beobNichtBeurteilt',
  ]
  if (table === 'ap') {
    void tsQueryClient.invalidateQueries({ queryKey: [`treeAp`] })
  } else if (apChildTables.includes(table) && parentId) {
    // useApNavData keys are ['treeAp', projId, apId, …filters]
    const projId = url[1]
    if (typeof projId === 'string') {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treeAp`, projId, parentId],
      })
    }
  }
  if (table === 'ziel') {
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeZieljahrs`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeZielsOfJahr`],
    })
  }
  if (parentTable === 'tpopfeldkontr') {
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontr`],
    })
  }
  if (['tpopfeldkontr', 'tpopfeldkontrFolder'].includes(menuType)) {
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontrzaehl`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
  }
}
