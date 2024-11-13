/**
 * moves a dataset to a different parent
 * used when moving for instance tpop to other pop in tree
 */
import { tables } from '../tables.js'
import { updateTpopkontrById } from './updateTpopkontrById.js'
import { updateTpopmassnById } from './updateTpopmassnById.js'
import { updateTpopById } from './updateTpopById.js'
import { updatePopById } from './updatePopById.js'

export const moveTo = async ({
  id: newParentId,
  store,
  client,
  tanstackQueryClient,
}) => {
  const { enqueNotification, moving, setMoving } = store
  let table = moving?.table
  const id = moving?.id

  // ensure derived data exists
  const tabelle = tables.find((t) => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  if (tabelle.dbTable) {
    table = tabelle.dbTable
  }
  const idField = tabelle ? tabelle.idField : undefined
  if (!idField) {
    return enqueNotification({
      message: 'change was not saved: Reason: idField was not found',
      options: {
        variant: 'error',
      },
    })
  }
  const parentIdField = tabelle.parentIdField
  if (!parentIdField) {
    return enqueNotification({
      message: 'change was not saved: Reason: parentIdField was not found',
      options: {
        variant: 'error',
      },
    })
  }

  // move
  switch (table) {
    case 'tpopkontr':
      client.mutate({
        mutation: updateTpopkontrById,
        variables: { id, tpopId: newParentId },
      })
      break
    case 'tpopmassn':
      client.mutate({
        mutation: updateTpopmassnById,
        variables: { id, tpopId: newParentId },
      })
      break
    case 'tpop':
      client.mutate({
        mutation: updateTpopById,
        variables: { id, popId: newParentId },
      })
      break
    case 'pop':
      client.mutate({
        mutation: updatePopById,
        variables: { id, apId: newParentId },
      })
      break
    default:
      // do nothing
      break
  }
  // reset moving
  setMoving({
    table: null,
    id: '99999999-9999-9999-9999-999999999999',
    label: null,
    toTable: null,
    fromParentId: null,
  })

  // update tree ap queries, tree pop folder queries, tree pop queries
  if (table === 'pop') {
    tanstackQueryClient.invalidateQueries({
      queryKey: [`treePop`],
    })
    tanstackQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
  }
  if (table === 'tpop') {
    tanstackQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })

    tanstackQueryClient.invalidateQueries({
      queryKey: ['treePopFolders'],
    })
  }
}
