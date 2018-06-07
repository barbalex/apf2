// @flow
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import omit from 'lodash/omit'
import gql from 'graphql-tag'
import app from 'ampersand-app'

import tables from '../../../../../modules/tables'
import listError from '../../../../../modules/listError'
import setTreeKey from './setTreeKey.graphql'

export default async ({
  dataPassedIn,
  deleteState,
  refetchTree,
}:{
  dataPassedIn: Object,
  deleteState: Object,
  refetchTree: () => void
}): Promise<void> => {
  const { client } = app
  // deleteDatasetDemand checks variables
  const { table: tablePassed, id, url, label } = deleteState.state.toDelete

  // some tables need to be translated, i.e. tpopfreiwkontr
  const tableMetadata = tables.find(t => t.table === tablePassed)
  if (!tableMetadata) {
    return listError(
      new Error(
        `Error in action deleteDatasetDemand: no table meta data found for table "${tablePassed}"`
      )
    )
  }
  const table = tableMetadata.dbTable ? tableMetadata.dbTable : tablePassed

  /**
   * fetch data for dataset
   * then add it to deletedDatasets
   */
  const queryName = `${camelCase(table)}ById`
  /**
   * cannot use `./${camelCase(table)}ById.graphql`
   * because webpack performs static analysis at build time
   * see: https://github.com/webpack/webpack/issues/6680#issuecomment-370800037
   */
  let result
  try {
    result = await client.query({
      query: await import('./' + queryName + '.graphql'),
      variables: { id },
    }) 
  } catch (error) {
    return listError(error)
  }
  let data = {...get(result, `data.${camelCase(table)}ById`)}
  data = omit(data, '__typename')

  // add to datasetsDeleted
  deleteState.addDataset({
    table,
    id,
    label,
    url,
    data,
    time: Date.now(),
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
      variables: { id },
    }) 
  } catch (error) {
    return listError(error)
  }

  // if tpop was deleted: set beob free
  // not necessary: is done by reference by db
  // BUT: need to refetch tree

  // set new url if necessary
  const activeNodeArray1 = get(dataPassedIn, 'tree.activeNodeArray')
  if (isEqual(activeNodeArray1, url)) {
    const newActiveNodeArray1 = [...url]
    newActiveNodeArray1.pop()
    // if zieljahr is active, need to pop again,
    // (in case there is no other ziel left in same year)
    if (table === 'ziel') {
      newActiveNodeArray1.pop()
    }
    await client.mutate({
      mutation: setTreeKey,
      variables: {
        value: newActiveNodeArray1,
        tree: 'tree',
        key: 'activeNodeArray'
      }
    })
  }
  const activeNodeArray2 = get(dataPassedIn, 'tree2.activeNodeArray')
  if (isEqual(activeNodeArray2, url)) {
    const newActiveNodeArray2 = [...url]
    newActiveNodeArray2.pop()
    // if zieljahr is active, need to pop again,
    // (in case there is no other ziel left in same year)
    if (table === 'ziel') {
      newActiveNodeArray2.pop()
    }
    await client.mutate({
      mutation: setTreeKey,
      variables: {
        value: newActiveNodeArray2,
        tree: 'tree2',
        key: 'activeNodeArray'
      }
    })
  }

  // remove from openNodes
  const openNodes1 = get(dataPassedIn, 'tree.openNodes')
  const newOpenNodes1 = openNodes1.filter(n => !isEqual(n, url))
  await client.mutate({
    mutation: setTreeKey,
    variables: {
      value: newOpenNodes1,
      tree: 'tree',
      key: 'openNodes'
    }
  })
  const openNodes2 = get(dataPassedIn, 'tree2.openNodes')
  const newOpenNodes2 = openNodes2.filter(n => !isEqual(n, url))
  await client.mutate({
    mutation: setTreeKey,
    variables: {
      value: newOpenNodes2,
      tree: 'tree2',
      key: 'openNodes'
    }
  })

  // reset datasetToDelete
  deleteState.emptyToDelete()

  refetchTree()
}
