import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../Row.jsx'
import { StoreContext } from '../../../../../../storeContext.js'
import { Users } from './Users.jsx'

export const UsersFolder = observer(({ count, isLoading, usersFilter }) => {
  const store = useContext(StoreContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.user ?? ''
  const message =
    isLoading ? '...'
    : nodeLabelFilterString ? `${count} gefiltert`
    : count

  const node = {
    nodeType: 'folder',
    menuType: 'userFolder',
    id: 'benutzerFolder',
    urlLabel: 'Benutzer',
    label: `Benutzer (${message})`,
    url: ['Benutzer'],
    hasChildren: count > 0,
  }

  const isOpen = store.tree.openNodes.some(
    (nodeArray) => nodeArray[0] === 'Benutzer',
  )

  return (
    <>
      <Row node={node} />
      {isOpen && <Users usersFilter={usersFilter} />}
    </>
  )
})
