/**
 * moves a dataset to a different parent
 * used when moving for instance tpop to other pop in tree
 */
import { tables } from '../tables.js'
import { updateTpopkontrById } from './updateTpopkontrById.js'
import { updateTpopmassnById } from './updateTpopmassnById.js'
import { updateTpopById } from './updateTpopById.js'
import { updatePopById } from './updatePopById.js'

export const moveTo = async ({ id: newParentId, store, apolloClient }) => {
  const { enqueNotification, moving, setMoving } = store
  const table = moving?.table
  const id = moving?.id

  // ensure derived data exists
  const tabelle = tables.find((t) => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  const dbTable = tabelle?.dbTable ?? table
  const idField = tabelle?.idField
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
  switch (dbTable) {
    case 'tpopkontr':
      await apolloClient.mutate({
        mutation: updateTpopkontrById,
        variables: { id, tpopId: newParentId },
      })
      break
    case 'tpopmassn':
      await apolloClient.mutate({
        mutation: updateTpopmassnById,
        variables: { id, tpopId: newParentId },
      })
      break
    case 'tpop':
      await apolloClient.mutate({
        mutation: updateTpopById,
        variables: { id, popId: newParentId },
      })
      break
    case 'pop':
      await apolloClient.mutate({
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
    store.queryClient.invalidateQueries({
      queryKey: [`treePop`],
    })
    store.queryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    store.queryClient.invalidateQueries({
      queryKey: ['treeAp'],
    })
  }
  if (table === 'tpop') {
    store.queryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    store.queryClient.invalidateQueries({
      queryKey: ['treePopFolders'],
    })
    store.queryClient.invalidateQueries({
      queryKey: ['treePop'],
    })
  }
  if (table === 'tpopmassn') {
    store.queryClient.invalidateQueries({
      queryKey: [`treeTpopmassn`],
    })
    store.queryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
  }
  if (table === 'tpopfeldkontr') {
    store.queryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontr`],
    })
    store.queryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
  }
  if (table === 'tpopfreiwkontr') {
    store.queryClient.invalidateQueries({
      queryKey: [`treeTpopfreiwkontr`],
    })
    store.queryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
  }
  return
}
