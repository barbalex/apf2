import { apiInsert } from '../../../modules/api.ts'
import { v7 as uuidv7 } from 'uuid'
import { upperFirst } from 'es-toolkit'

import { tables } from '../../../modules/tables.ts'
import {
  store,
  apolloClientAtom,
  tsQueryClientAtom,
  addNotificationAtom,
  navigateAtom,
  userNameAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
  type Notification,
} from '../../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const insertDataset = async ({
  tablePassed,
  parentId,
  menuType,
  singleElementUrlName: singleElementName,
  url,
  search,
  jahr: jahrPassed,
}: {
  tablePassed: string
  parentId?: string | null | undefined
  menuType: string
  singleElementUrlName?: string | null | undefined
  url: (string | number)[]
  search: string
  jahr?: string | null | undefined
}) => {
  const apolloClient = store.get(apolloClientAtom)
  const tsQueryClient = store.get(tsQueryClientAtom)
  if (!apolloClient) {
    return addNotification({
      message: 'no apollo client found in store',
      options: {
        variant: 'error',
      },
    })
  }
  if (!tsQueryClient) {
    return addNotification({
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
    return addNotification({
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
    return addNotification({
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
    return addNotification({
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
  const queryKeyFolder =
    ['apberuebersicht'].includes(table) ? 'treeRoot'
    : table === 'ziel' ? 'treeZiel'
    : parentTable === 'tpopfeldkontr' ? 'treeTpopfeldkontrzaehlFolders'
    : parentTable === 'tpopfreiwkontr' ? 'treeTpopfreiwkontrzaehlFolders'
    : (
      [
        'adresse',
        'tpop_apberrelevant_grund_werte',
        'ek_abrechnungstyp_werte',
        'tpopkontrzaehl_einheit_werte',
      ].includes(table)
    ) ?
      'treeWerteFolders'
    : `tree${upperFirst(parentTable ?? '')}Folders`
  // console.log('insertDataset', {
  //   table,
  //   parentTable,
  //   menuType,
  //   queryKeyFoldersTable: queryKeyFolder,
  //   queryKeyTable,
  //   queryKeyFolder,
  // })
  void tsQueryClient.invalidateQueries({
    queryKey: [queryKeyFolder],
  })
  // also invalidate parent queries for folder counts
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeApFolders`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`treeAp`],
  })
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
