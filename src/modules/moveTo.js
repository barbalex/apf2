// @flow
/**
 * moves a dataset to a different parent
 * used when moving for instance tpop to other pop in tree
 */
import gql from 'graphql-tag'
import get from 'lodash/get'

import tables from './tables'
import listError from './listError'

export default async (store: Object, newParentId: String, client: Object): any => {
  const { data } = await client.query({
    query: gql`
        query Query {
          moving @client {
            table
            id
            label
          }
        }
      `
  })
  let table = get(data, 'moving.table')
  const id = get(data, 'moving.id')

  // ensure derived data exists
  const tabelle: {
    table: String,
    dbTable: ?String,
    idField: String,
    parentIdField: String,
  } = tables.find(t => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  if (tabelle.dbTable) {
    table = tabelle.dbTable
  }
  const idField = tabelle ? tabelle.idField : undefined
  if (!idField) {
    return listError(new Error('change was not saved: Reason: idField was not found'))
  }
  const parentIdField = tabelle.parentIdField
  if (!parentIdField) {
    return listError(new Error('change was not saved: Reason: parentIdField was not found'))
  }

  // move
  switch (table) {
    case 'tpopkontr':
      client.mutate({
        mutation: gql`
          mutation updateTpopkontrById($id: UUID!, $tpopId: UUID!) {
            updateTpopkontrById(id: $id, tpopId: $tpopId) {
              input: {
                id: $id
                tpopkontrPatch: {
                  tpopId: $tpopId
                }
              }
            }
          }
        `,
        variables: { id, tpopId: newParentId },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTpopkontrById: {
            tpopkontr: {
              tpopId: newParentId,
              __typename: 'Tpopkontr',
            },
            __typename: 'Tpopkontr',
          },
        },
      })
      break;
    case 'tpopmassn':
      client.mutate({
        mutation: gql`
          mutation updateTpopmassnById($id: UUID!, $tpopId: UUID!) {
            updateTpopmassnById(id: $id, tpopId: $tpopId) {
              input: {
                id: $id
                tpopmassnPatch: {
                  tpopId: $tpopId
                }
              }
            }
          }
        `,
        variables: { id, tpopId: newParentId },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTpopmassnById: {
            tpopmassn: {
              tpopId: newParentId,
              __typename: 'Tpopmassn',
            },
            __typename: 'Tpopmassn',
          },
        },
      })
      break;
    case 'tpop':
      client.mutate({
        mutation: gql`
          mutation updateTpopById($id: UUID!, $popId: UUID!) {
            updateTpopById(id: $id, popId: $popId) {
              input: {
                id: $id
                tpopPatch: {
                  popId: $popId
                }
              }
            }
          }
        `,
        variables: { id, popId: newParentId },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTpopById: {
            tpop: {
              popId: newParentId,
              __typename: 'Tpop',
            },
            __typename: 'Tpop',
          },
        },
      })
      break;
    case 'pop':
      client.mutate({
        mutation: gql`
          mutation updatePopById($id: UUID!, $apId: UUID!) {
            updatePopById(id: $id, apId: $apId) {
              input: {
                id: $id
                popPatch: {
                  apId: $apId
                }
              }
            }
          }
        `,
        variables: { id, apId: newParentId },
        optimisticResponse: {
          __typename: 'Mutation',
          updatePopById: {
            pop: {
              apId: newParentId,
              __typename: 'Pop',
            },
            __typename: 'Pop',
          },
        },
      })
      break;
    default:
      // do nothing
      break;
  }
  // reset moving
  client.mutate({
    mutation: gql`
      mutation setMoving($table: String!, $id: UUID!, $label: String!) {
        setMoving(table: $table, id: $id, label: $label) @client {
          table
          id
          label
        }
      }
    `,
    variables: { table: null, id: null, label: null }
  })
}
