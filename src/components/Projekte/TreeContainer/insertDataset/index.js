// @flow
import gql from 'graphql-tag'
import app from 'ampersand-app'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import get from 'lodash/get'

import tables from '../../../../modules/tables'
import listError from '../../../../modules/listError'
import setTreeKey from './setTreeKey.graphql'

export default async ({
  store,
  tree,
  tablePassed,
  parentId,
  baseUrl,
  refetch,
}:{
  store: Object,
  tree: Object,
  tablePassed: String,
  parentId: String,
  baseUrl: Array<String>,
  refetch: () => void,
}): any => {
  const { client } = app
  let table = tablePassed
  // insert new dataset in db and fetch id
  const tableMetadata: {
    table: String,
    dbTable: ?String,
    parentIdField: String,
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
  const parentIdField = camelCase(tableMetadata.parentIdField)
  const idField = tableMetadata.idField
  if (!idField) {
    return listError(
      new Error('new dataset not created as no idField could be found')
    )
  }

  let result
  try {
    result = await client.mutate({
      mutation: gql`
          mutation create${upperFirst(camelCase(table))}(
            $parentId: UUID!
          ) {
            create${upperFirst(camelCase(table))} (
              input: {
                ${camelCase(table)}: {
                  ${parentIdField}: $parentId
                }
              }
            ) {
            ${camelCase(table)} {
              id
              ${parentIdField}
            }
          }
        }
      `,
      variables: { parentId }
    })
  } catch (error) {
    listError(error)
  }
  const row = get(result, `data.create${upperFirst(camelCase(table))}.${camelCase(table)}`)
  /**
   * TODO
   * for adding new ap
   * need to pass active project and add that to the new ap being created
   * meanwhile it works because project 1 is set as standard value
   * wait to do this in graphQL because new projects are not used yet
   */
  // set new url
  const newActiveNodeArray = [
    ...baseUrl,
    row[idField]
  ]
  await app.client.mutate({
    mutation: setTreeKey,
    variables: {
      value: newActiveNodeArray,
      tree: tree.name,
      key: 'activeNodeArray'
    }
  })
  // set open nodes
  const { openNodes } = tree
  const newOpenNodes = [
    ...openNodes,
    newActiveNodeArray
  ]
  await app.client.mutate({
    mutation: setTreeKey,
    variables: {
      value: newOpenNodes,
      tree: tree.name,
      key: 'openNodes'
    }
  })

  // if zieljahr, need to update jahr
  /*
  if (tree.activeNodes.zieljahr) {
    store.updateProperty(tree, 'jahr', tree.activeNodes.zieljahr)
    store.updatePropertyInDb(tree, 'jahr', tree.activeNodes.zieljahr)
  }
  // if tpopfreiwkontr need to update typ
  if (tablePassed === 'tpopfreiwkontr') {
    store.updateProperty(tree, 'typ', 'Freiwilligen-Erfolgskontrolle')
    store.updatePropertyInDb(tree, 'typ', 'Freiwilligen-Erfolgskontrolle')
  }*/

  refetch()
}
