import gql from 'graphql-tag'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import get from 'lodash/get'

import tables from '../../../modules/tables'
import {
  adresse as adresseFragment,
  user as userFragment,
} from '../../shared/fragments'

export default async ({
  treeName,
  tablePassed,
  parentId,
  id,
  menuType,
  url,
  client,
  store,
}) => {
  const { addError, refetch } = store
  const { setActiveNodeArray, openNodes, setOpenNodes } = store[treeName]
  let table = tablePassed
  // insert new dataset in db and fetch id
  const tableMetadata: {
    table: String,
    dbTable: ?String,
    parentIdField: String,
  } = tables.find(t => t.table === table)
  if (!tableMetadata) {
    return addError(new Error(`no table meta data found for table "${table}"`))
  }
  // some tables need to be translated, i.e. tpopfreiwkontr
  if (tableMetadata.dbTable) {
    table = tableMetadata.dbTable
  }
  const parentIdField = camelCase(tableMetadata.parentIdField)
  const idField = tableMetadata.idField
  if (!idField) {
    return addError(
      new Error('new dataset not created as no idField could be found'),
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
  if (['userFolder', 'user'].includes(menuType)) {
    mutation = gql`
      mutation createUser($role: String!) {
        createUser(input: { user: { role: $role } }) {
          user {
            ...UserFields
          }
        }
      }
      ${userFragment}
    `
    delete variables.parentId
    variables.role = 'apflora_reader'
  }
  if (['adresseFolder', 'adresse'].includes(menuType)) {
    mutation = gql`
      mutation createAdresse {
        createAdresse(input: { adresse: {} }) {
          adresse {
            ...AdresseFields
          }
        }
      }
      ${adresseFragment}
    `
    delete variables.parentId
  }

  let result
  try {
    if (Object.keys(variables).length) {
      result = await client.mutate({ mutation, variables })
    } else {
      result = await client.mutate({ mutation })
    }
  } catch (error) {
    return addError(error)
  }
  const row = get(
    result,
    `data.create${upperFirst(camelCase(table))}.${camelCase(table)}`,
  )
  // set new url
  const newActiveNodeArray = [...url, row[idField]]
  setActiveNodeArray(newActiveNodeArray)
  // set open nodes
  let newOpenNodes = [...openNodes, newActiveNodeArray]
  if (['zielFolder', 'zieljahrFolder'].includes(menuType)) {
    const urlWithoutJahr = [...url]
    urlWithoutJahr.pop()
    newOpenNodes = [...openNodes, urlWithoutJahr, newActiveNodeArray]
  }
  setOpenNodes(newOpenNodes)
  const refetchName = `${table === 'tpopkontrzaehl' ? table : tablePassed}s`
  refetch[refetchName]()
}
