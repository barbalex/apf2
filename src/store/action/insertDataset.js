// @flow
import axios from 'axios'
import gql from 'graphql-tag'
import app from 'ampersand-app'

import tables from '../../modules/tables'
import listError from '../../modules/listError'

export default async (
  store: Object,
  tree: Object,
  tablePassed: string,
  parentId: number,
  baseUrl: Array<string>
): any => {
  let table = tablePassed
  if (!table) {
    return listError(new Error('no table passed'))
  }
  // insert new dataset in db and fetch id
  const tableMetadata: {
    table: string,
    dbTable: ?string,
    parentIdField: string,
  } = tables.find(t => t.table === table)
  if (!tableMetadata) {
    return listError(
      new Error(`no table meta data found for table "${table}"`)
    )
  }
  // some tables need to be translated, i.e. tpopfreiwkontr
  if (tableMetadata.dbTable) {
    table = tableMetadata.dbTable
  }
  const parentIdField = tableMetadata.parentIdField
  const idField = tableMetadata.idField
  if (!idField) {
    return listError(
      new Error('new dataset not created as no idField could be found')
    )
  }

  let result: { data: Array<Object> }
  try {
    result = await axios({
      method: 'POST',
      url: `/${table}`,
      data: { [parentIdField]: isNaN(parentId) ? parentId : +parentId },
      headers: {
        Prefer: 'return=representation',
      },
    })
  } catch (error) {
    return listError(error)
  }
  /**
   * TODO
   * for adding new ap
   * need to pass active project and add that to the new ap being created
   * meanwhile it works because project 1 is set as standard value
   * wait to do this in graphQL because new projects are not used yet
   */
  const row = result.data[0]
  // insert this dataset in store.table
  store.table[table].set(row[idField], row)
  // set new url
  baseUrl.push(row[idField])
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
      value: baseUrl,
      tree: tree.name,
      key: 'activeNodeArray'
    }
  })
  // if zieljahr, need to update jahr
  if (tree.activeNodes.zieljahr) {
    store.updateProperty(tree, 'jahr', tree.activeNodes.zieljahr)
    store.updatePropertyInDb(tree, 'jahr', tree.activeNodes.zieljahr)
  }
  // if tpopfreiwkontr need to update typ
  if (tablePassed === 'tpopfreiwkontr') {
    store.updateProperty(tree, 'typ', 'Freiwilligen-Erfolgskontrolle')
    store.updatePropertyInDb(tree, 'typ', 'Freiwilligen-Erfolgskontrolle')
  }
}
