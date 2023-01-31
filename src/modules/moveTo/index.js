/**
 * moves a dataset to a different parent
 * used when moving for instance tpop to other pop in tree
 */
import tables from '../tables'
import updateTpopkontrById from './updateTpopkontrById'
import updateTpopmassnById from './updateTpopmassnById'
import updateTpopById from './updateTpopById'
import updatePopById from './updatePopById'

const moveTo = async ({ id: newParentId, store, client }) => {
  const { enqueNotification, moving, setMoving } = store
  let { table } = moving
  const { id } = moving

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
      store.tree.incrementRefetcher()
      break
    case 'tpopmassn':
      client.mutate({
        mutation: updateTpopmassnById,
        variables: { id, tpopId: newParentId },
      })
      store.tree.incrementRefetcher()
      break
    case 'tpop':
      client.mutate({
        mutation: updateTpopById,
        variables: { id, popId: newParentId },
      })
      store.tree.incrementRefetcher()
      break
    case 'pop':
      console.log('will move pop', { id, newParentId })
      client.mutate({
        mutation: updatePopById,
        variables: { id, apId: newParentId },
      })
      store.tree.incrementRefetcher()
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
  })
}

export default moveTo
