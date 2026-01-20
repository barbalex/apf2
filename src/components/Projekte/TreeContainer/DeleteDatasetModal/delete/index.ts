import { isEqual } from 'es-toolkit'
import { upperFirst } from 'es-toolkit'
import { camelCase } from 'es-toolkit'
import { omit } from 'es-toolkit'
import { gql } from '@apollo/client'
import { getSnapshot } from 'mobx-state-tree'

import { tables } from '../../../../../modules/tables.js'
import {
  store as jotaiStore,
  tsQueryClientAtom,
  apolloClientAtom,
  addNotificationAtom,
  navigateAtom,
} from '../../../../../JotaiStore/index.ts'

const addNotification = (notification) =>
  jotaiStore.set(addNotificationAtom, notification)

const isFreiwilligenKontrolle = (activeNodeArray) =>
  activeNodeArray[activeNodeArray.length - 2] === 'Freiwilligen-Kontrollen'

export const deleteModule = async ({ store, search }) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)
  const tsQueryClient = jotaiStore.get(tsQueryClientAtom)
  const navigate = jotaiStore.get(navigateAtom)
  const {
    emptyToDelete,
    addDeletedDataset,
    toDeleteTable: tablePassed,
    toDeleteId,
    toDeleteUrl,
    toDeleteLabel,
    toDeleteAfterDeletionHook,
  } = store
  // some tables need to be translated, i.e. tpopfreiwkontr
  const tableMetadata = tables.find((t) => t.table === tablePassed)
  const parentTable = tableMetadata?.parentTable
  if (!tableMetadata) {
    return addNotification({
      message: `Error in action deleteDatasetDemand: no table meta data found for table "${tablePassed}"`,
      options: {
        variant: 'error',
      },
    })
  }
  const table = tableMetadata.dbTable ? tableMetadata.dbTable : tablePassed
  // console.log('deleteModule', { tableMetadata, table, parentTable })

  /**
   * fetch data for dataset
   * then add it to deletedDatasets
   */
  const isWerte = table.toLowerCase().includes('werte')
  const tableName = camelCase(table)
  const queryName = `${tableName}ById`
  /**
   * cannot use `./${camelCase(table)}ById`
   * because webpack performs static analysis at build time
   * see: https://github.com/webpack/webpack/issues/6680#issuecomment-370800037
   */
  let query
  if (isWerte) {
    query = gql`
      query werteById($id: UUID!) {
        ${queryName}(id: $id) {
          id
          code
          text
          sort
          changedBy
        }
      }
    `
  } else {
    const qrObject = await import(`./queries/${queryName}.ts`)
    query = qrObject.default
  }
  let result
  try {
    result = await apolloClient.query({
      query,
      variables: { id: toDeleteId },
    })
  } catch (error) {
    console.log(error)
    return addNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  let data = { ...result?.[`data.${camelCase(table)}ById`] }
  data = omit(data, ['__typename'])

  // add to datasetsDeleted
  addDeletedDataset({
    table,
    id: toDeleteId,
    label: toDeleteLabel,
    url: toDeleteUrl,
    data,
    time: Date.now(),
    afterDeletionHook: toDeleteAfterDeletionHook,
  })

  try {
    await apolloClient.mutate({
      mutation: gql`
        mutation deleteSomething($id: UUID!) {
          delete${upperFirst(camelCase(table))}ById(input: { id: $id }) {
            ${camelCase(table)} {
              id
            }
          }
        }
      `,
      variables: { id: toDeleteId },
    })
  } catch (error) {
    return addNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }

  // if tpop was deleted: set beob free
  // not necessary: is done by reference by db
  // BUT: need to refetch tree

  // set new url if necessary
  const activeNodeArray1 = store?.tree?.activeNodeArray
  if (
    isEqual(activeNodeArray1, toDeleteUrl) &&
    !isFreiwilligenKontrolle(activeNodeArray1)
  ) {
    const newActiveNodeArray1 = [...toDeleteUrl]
    newActiveNodeArray1.pop()
    // if zieljahr is active, need to pop again,
    // (in case there is no other ziel left in same year)
    if (table === 'ziel') {
      newActiveNodeArray1.pop()
    }
    setTimeout(
      () => navigate(`/Daten/${newActiveNodeArray1.join('/')}${search}`),
      300,
    )
  }

  // remove from openNodes
  const openNodesRaw = store?.tree?.openNodes
  const openNodes = getSnapshot(openNodesRaw)
  const newOpenNodes = openNodes.filter((n) => !isEqual(n, toDeleteUrl))
  store.tree.setOpenNodes(newOpenNodes)
  // invalidate tree queries for count and data
  if (['user', 'message', 'currentissue'].includes(table)) {
    tsQueryClient.invalidateQueries({ queryKey: ['treeRoot'] })
  }

  const queryKeyTable =
    parentTable === 'tpopfeldkontr' ? 'treeTpopfeldkontr'
    : parentTable === 'tpopfreiwkontr' ? 'treeTpopfreiwkontr'
    : table === 'tpop_apberrelevant_grund_werte' ?
      'treeTpopApberrelevantGrundWerte'
    : table === 'ek_abrechnungstyp_werte' ? 'treeEkAbrechnungstypWerte'
    : table === 'tpopkontrzaehl_einheit_werte' ?
      'treeTpopkontrzaehlEinheitWerte'
    : `tree${upperFirst(table)}`
  tsQueryClient.invalidateQueries({
    queryKey: [queryKeyTable],
  })
  const queryKeyFolders =
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
    : `tree${upperFirst(parentTable)}Folders`
  // console.log('Tree: deleting node', {
  //   queryKeyFoldersTable,parentTable,
  //   queryToInvalidate: `tree${upperFirst(queryKeyFoldersTable)}Folders`,
  // })
  tsQueryClient.invalidateQueries({
    queryKey: [queryKeyFolders],
  })
  if (table === 'ziel') {
    tsQueryClient.invalidateQueries({
      queryKey: [`treeZieljahrs`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeZielsOfJahr`],
    })
  }
  if (parentTable === 'tpopfeldkontr') {
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontr`],
    })
  }

  if (toDeleteAfterDeletionHook) toDeleteAfterDeletionHook()

  // reset datasetToDelete
  emptyToDelete()
}
