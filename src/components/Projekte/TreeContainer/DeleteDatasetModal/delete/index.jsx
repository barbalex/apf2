import isEqual from 'lodash/isEqual'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import omit from 'lodash/omit'
import { gql } from '@apollo/client'
import { getSnapshot } from 'mobx-state-tree'

import { tables } from '../../../../../modules/tables.js'

const isFreiwilligenKontrolle = (activeNodeArray) =>
  activeNodeArray[activeNodeArray.length - 2] === 'Freiwilligen-Kontrollen'

export const deleteModule = async ({ client, store, search }) => {
  const {
    emptyToDelete,
    addDeletedDataset,
    enqueNotification,
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
    return enqueNotification({
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
    const qrObject = await import(`./queries/${queryName}.js`)
    query = qrObject.default
  }
  let result
  try {
    result = await client.query({
      query,
      variables: { id: toDeleteId },
    })
  } catch (error) {
    console.log(error)
    return enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  let data = { ...result?.[`data.${camelCase(table)}ById`] }
  data = omit(data, '__typename')

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
    await client.mutate({
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
    return enqueNotification({
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
    store.navigate(`/Daten/${newActiveNodeArray1.join('/')}${search}`)
  }

  // remove from openNodes
  const openNodesRaw = store?.tree?.openNodes
  const openNodes = getSnapshot(openNodesRaw)
  const newOpenNodes = openNodes.filter((n) => !isEqual(n, toDeleteUrl))
  store.tree.setOpenNodes(newOpenNodes)
  // invalidate tree queries for count and data
  if (['user', 'message', 'currentissue'].includes(table)) {
    store.queryClient.invalidateQueries({ queryKey: ['treeRoot'] })
  }

  const queryKeyTable =
    parentTable === 'tpopfeldkontr' ? 'treeTpopfeldkontrs'
    : parentTable === 'tpopfreiwkontr' ? 'treeTpopfreiwkontrs'
    : table === 'tpop_apberrelevant_grund_werte' ?
      'treeTpopApberrelevantGrundWerte'
    : table === 'ek_abrechnungstyp_werte' ? 'treeEkAbrechnungstypWertes'
    : table === 'tpopkontrzaehl_einheit_werte' ?
      'treeTpopkontrzaehlEinheitWertes'
    : `tree${upperFirst(table)}`
  store.queryClient.invalidateQueries({
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
  store.queryClient.invalidateQueries({
    queryKey: [queryKeyFolders],
  })
  if (table === 'ziel') {
    store.queryClient.invalidateQueries({
      queryKey: [`treeZieljahrs`],
    })
    store.queryClient.invalidateQueries({
      queryKey: [`treeZielsOfJahr`],
    })
  }

  if (toDeleteAfterDeletionHook) toDeleteAfterDeletionHook()

  // reset datasetToDelete
  emptyToDelete()
}
