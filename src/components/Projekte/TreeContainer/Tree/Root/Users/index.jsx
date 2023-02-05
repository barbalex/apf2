import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../Row'
import storeContext from '../../../../../../storeContext'
import Users from './Users'

const UserFolderNode = ({ count, isLoading, usersFilter }) => {
  const store = useContext(storeContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.user ?? ''
  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
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
      <Row key={node.id} node={node} />
      {isOpen && <Users usersFilter={usersFilter} />}
    </>
  )
}

export default observer(UserFolderNode)
