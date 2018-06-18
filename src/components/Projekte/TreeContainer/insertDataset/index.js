// @flow
import gql from 'graphql-tag'
import app from 'ampersand-app'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import get from 'lodash/get'

import tables from '../../../../modules/tables'
import setTreeKey from './setTreeKey.graphql'

export default async ({
  tree,
  tablePassed,
  parentId,
  id,
  menuType,
  baseUrl,
  refetch,
  errorState,
}:{
  tree: Object,
  tablePassed: String,
  parentId: String,
  id: String,
  menuType: String,
  baseUrl: Array<String>,
  refetch: () => void,
  errorState: Object,
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
    return errorState.add(
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
    return errorState.add(
      new Error('new dataset not created as no idField could be found')
    )
  }
  let mutation = gql`
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
  }`
  let variables = { parentId }

  let jahr
  if (menuType === 'zielFolder') {
    jahr = 1
  }
  if (menuType === 'zieljahrFolder') {
    jahr = +id
    mutation = gql`
      mutation create${upperFirst(camelCase(table))}(
        $parentId: UUID!
        $jahr: Int
      ) {
        create${upperFirst(camelCase(table))} (
          input: {
            ${camelCase(table)}: {
              ${parentIdField}: $parentId
              jahr: $jahr
            }
          }
        ) {
        ${camelCase(table)} {
          id
          ${parentIdField}
        }
      }
    }`
    variables = { parentId, jahr }
  }
  if (menuType === 'tpopfreiwkontrFolder') {
    mutation = gql`
      mutation create${upperFirst(camelCase(table))}(
        $parentId: UUID!
      ) {
        create${upperFirst(camelCase(table))} (
          input: {
            ${camelCase(table)}: {
              ${parentIdField}: $parentId
              typ: "Freiwilligen-Erfolgskontrolle"
            }
          }
        ) {
        ${camelCase(table)} {
          id
          ${parentIdField}
        }
      }
    }`
  }

  let result
  try {
    result = await client.mutate({ mutation, variables })
  } catch (error) {
    errorState.add(error)
  }
  const row = get(result, `data.create${upperFirst(camelCase(table))}.${camelCase(table)}`)
  // set new url
  const newActiveNodeArray = [
    ...baseUrl,
    row[idField]
  ]
  await client.mutate({
    mutation: setTreeKey,
    variables: {
      value: newActiveNodeArray,
      tree: tree.name,
      key: 'activeNodeArray'
    }
  })
  // set open nodes
  const { openNodes } = tree
  let newOpenNodes = [
    ...openNodes,
    newActiveNodeArray
  ]
  if (['zielFolder', 'zieljahrFolder'].includes(menuType)) {
    const urlWithoutJahr = [...baseUrl]
    urlWithoutJahr.pop()
    //newOpenNodes.push(urlWithoutJahr)
    newOpenNodes = [
      ...openNodes,
      urlWithoutJahr,
      newActiveNodeArray
    ]
  }
  await client.mutate({
    mutation: setTreeKey,
    variables: {
      value: newOpenNodes,
      tree: tree.name,
      key: 'openNodes'
    }
  })

  refetch()
}
