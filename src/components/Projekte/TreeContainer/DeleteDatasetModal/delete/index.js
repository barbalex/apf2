// @flow
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import omit from 'lodash/omit'
import gql from 'graphql-tag'

import tables from '../../../../../modules/tables'

const isFreiwilligenKontrolle = activeNodeArray =>
  activeNodeArray[activeNodeArray.length - 2] === 'Freiwilligen-Kontrollen'

export default async ({
  client,
  mobxStore,
}: {
  client: Object,
  mobxStore: Object,
}): Promise<void> => {
  const {
    emptyToDelete,
    addDeletedDataset,
    addError,
    toDeleteTable: tablePassed,
    toDeleteId,
    toDeleteUrl,
    toDeleteLabel,
    toDeleteAfterDeletionHook,
  } = mobxStore

  // some tables need to be translated, i.e. tpopfreiwkontr
  const tableMetadata = tables.find(t => t.table === tablePassed)
  if (!tableMetadata) {
    return addError(
      new Error(
        `Error in action deleteDatasetDemand: no table meta data found for table "${tablePassed}"`,
      ),
    )
  }
  const table = tableMetadata.dbTable ? tableMetadata.dbTable : tablePassed

  /**
   * fetch data for dataset
   * then add it to deletedDatasets
   */
  const queryName = `${camelCase(table)}ById`
  /**
   * cannot use `./${camelCase(table)}ById`
   * because webpack performs static analysis at build time
   * see: https://github.com/webpack/webpack/issues/6680#issuecomment-370800037
   */
  let result
  try {
    const query = await import(`./${queryName}`) //.then(m => m.default)
    result = await client.query({
      query: query.default,
      variables: { id: toDeleteId },
    })
  } catch (error) {
    return addError(error)
  }
  let data = { ...get(result, `data.${camelCase(table)}ById`) }
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
        mutation delete${upperFirst(camelCase(table))}($id: UUID!) {
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
    return addError(error)
  }

  // if tpop was deleted: set beob free
  // not necessary: is done by reference by db
  // BUT: need to refetch tree

  // set new url if necessary
  const activeNodeArray1 = get(mobxStore, 'tree.activeNodeArray')
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
    mobxStore.tree.setActiveNodeArray(newActiveNodeArray1)
  }
  const activeNodeArray2 = get(mobxStore, 'tree2.activeNodeArray')
  if (
    isEqual(activeNodeArray2, toDeleteUrl) &&
    !isFreiwilligenKontrolle(activeNodeArray2)
  ) {
    const newActiveNodeArray2 = [...toDeleteUrl]
    newActiveNodeArray2.pop()
    // if zieljahr is active, need to pop again,
    // (in case there is no other ziel left in same year)
    if (table === 'ziel') {
      newActiveNodeArray2.pop()
    }
    mobxStore.tree2.setActiveNodeArray(newActiveNodeArray2)
  }

  // remove from openNodes
  const openNodes1 = get(mobxStore, 'tree.openNodes')
  const newOpenNodes1 = openNodes1.filter(n => !isEqual(n, toDeleteUrl))
  mobxStore.tree.setOpenNodes(newOpenNodes1)
  const openNodes2 = get(mobxStore, 'tree2.openNodes')
  const newOpenNodes2 = openNodes2.filter(n => !isEqual(n, toDeleteUrl))
  mobxStore.tree2.setOpenNodes(newOpenNodes2)

  if (toDeleteAfterDeletionHook) toDeleteAfterDeletionHook()

  // reset datasetToDelete
  emptyToDelete()
}
