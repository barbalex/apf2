// @flow
import gql from 'graphql-tag'
import app from 'ampersand-app'

import tables from '../../modules/tables'
import listError from '../../modules/listError'
import deleteDataset from './deleteDataset'

export default async (store: Object, tree: Object): Promise<void> => {
  // deleteDatasetDemand checks variables
  const { table: tablePassed, id, idField, url } = store.datasetToDelete
  let table = tablePassed
  const tableMetadata = tables.find(t => t.table === table)
  if (!tableMetadata) {
    return listError(
      new Error(
        `Error in action deleteDatasetDemand: no table meta data found for table "${table}"`
      )
    )
  }
  // some tables need to be translated, i.e. tpopfreiwkontr
  if (tableMetadata.dbTable) {
    table = tableMetadata.dbTable
  }

  // pass to function that can be used also for deleting
  // without modal popping up
  try {
    await deleteDataset({
      store,
      table,
      idField,
      id,
    })
  } catch (error) {
    listError(error)
  }

  // set new url
  url.pop()
  await app.client.mutate({
    mutation: gql`
      mutation setTreeKey($value: Array!, $tree: String!, $key: String!) {
        setTreeKey(tree: $tree, key: $key, value: $value) @client {
          tree @client {
            apFilter
            __typename: Tree
          }
        }
      }
    `,
    variables: {
      value: url,
      tree: tree.name,
      key: 'activeNodeArray'
    }
  })
  store.datasetToDelete = {}
  // if zieljahr is active, need to pop again, if there is no other ziel left in same year
  if (tree.activeNodes.zieljahr && !tree.activeNodes.zielber) {
    // see if there are ziele left with this zieljahr
    const zieleWithActiveZieljahr = Array.from(
      store.table.ziel.values()
    ).filter(
      ziel =>
        ziel.ap_id === tree.activeNodes.ap &&
        ziel.jahr === tree.activeNodes.zieljahr
    )
    if (zieleWithActiveZieljahr.length === 0) {
      url.pop()
      app.client.mutate({
        mutation: gql`
          mutation setTreeKey($value: Array!, $tree: String!, $key: String!) {
            setTreeKey(tree: $tree, key: $key, value: $value) @client {
              tree @client {
                apFilter
                __typename: Tree
              }
            }
          }
        `,
        variables: {
          value: url,
          tree: tree.name,
          key: 'activeNodeArray'
        }
      })
    }
  }
}
