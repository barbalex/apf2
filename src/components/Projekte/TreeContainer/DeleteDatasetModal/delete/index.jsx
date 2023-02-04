import isEqual from 'lodash/isEqual'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import omit from 'lodash/omit'
import { gql } from '@apollo/client'

import tables from '../../../../../modules/tables'

const isFreiwilligenKontrolle = (activeNodeArray) =>
  activeNodeArray[activeNodeArray.length - 2] === 'Freiwilligen-Kontrollen'

const deleteModule = async ({ client, store, search }) => {
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
  const openNodes1 = store?.tree?.openNodes
  const newOpenNodes1 = openNodes1.filter((n) => !isEqual(n, toDeleteUrl))
  store.tree.setOpenNodes(newOpenNodes1)
  // invalidate tree queries for count and data
  if (['user', 'message', 'currentissue'].includes(table)) {
    store.queryClient.invalidateQueries({ queryKey: ['treeRoot'] })
  }
  store.queryClient.invalidateQueries({
    queryKey: [`tree${upperFirst(table)}`],
  })
  store.queryClient.invalidateQueries({
    queryKey: [`tree${upperFirst(parentTable)}Folders`],
  })

  if (toDeleteAfterDeletionHook) toDeleteAfterDeletionHook()

  // reset datasetToDelete
  emptyToDelete()
}

export default deleteModule
