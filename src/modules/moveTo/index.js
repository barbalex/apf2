// @flow
/**
 * moves a dataset to a different parent
 * used when moving for instance tpop to other pop in tree
 */
import get from 'lodash/get'
import app from 'ampersand-app'

import tables from '../tables'
import movingGql from './moving'
import updateTpopkontrById from './updateTpopkontrById'
import updateTpopmassnById from './updateTpopmassnById'
import updateTpopById from './updateTpopById'
import updatePopById from './updatePopById'
import setMoving from './setMoving'

export default async ({
  id: newParentId,
  errorState,
}: {
  newParentId: String,
  errorState: Object,
}): any => {
  const { client } = app
  const { data } = await client.query({
    query: movingGql,
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
    return errorState.add(
      new Error('change was not saved: Reason: idField was not found'),
    )
  }
  const parentIdField = tabelle.parentIdField
  if (!parentIdField) {
    return errorState.add(
      new Error('change was not saved: Reason: parentIdField was not found'),
    )
  }

  // move
  switch (table) {
    case 'tpopkontr':
      client.mutate({
        mutation: updateTpopkontrById,
        variables: { id, tpopId: newParentId },
        /*optimisticResponse: {
          __typename: 'Mutation',
          updateTpopkontrById: {
            tpopkontr: {
              tpopId: newParentId,
              __typename: 'Tpopkontr',
            },
            __typename: 'Tpopkontr',
          },
        },*/
      })
      break
    case 'tpopmassn':
      client.mutate({
        mutation: updateTpopmassnById,
        variables: { id, tpopId: newParentId },
        /*optimisticResponse: {
          __typename: 'Mutation',
          updateTpopmassnById: {
            tpopmassn: {
              tpopId: newParentId,
              __typename: 'Tpopmassn',
            },
            __typename: 'Tpopmassn',
          },
        },*/
      })
      break
    case 'tpop':
      client.mutate({
        mutation: updateTpopById,
        variables: { id, popId: newParentId },
        /*optimisticResponse: {
          __typename: 'Mutation',
          updateTpopById: {
            tpop: {
              popId: newParentId,
              __typename: 'Tpop',
            },
            __typename: 'Tpop',
          },
        },*/
      })
      break
    case 'pop':
      client.mutate({
        mutation: updatePopById,
        variables: { id, apId: newParentId },
        /*optimisticResponse: {
          __typename: 'Mutation',
          updatePopById: {
            pop: {
              apId: newParentId,
              __typename: 'Pop',
            },
            __typename: 'Pop',
          },
        },*/
      })
      break
    default:
      // do nothing
      break
  }
  // reset moving
  client.mutate({
    mutation: setMoving,
    variables: {
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
    },
  })
}
