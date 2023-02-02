import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../Tree/Row'
import storeContext from '../../../../storeContext'
import Users from './Users'

const UserFolderNode = ({ treeQueryVariables, count, isLoading }) => {
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

  if (!node) return null

  return (
    <>
      <Row node={node} />
      {isOpen && <Users treeQueryVariables={treeQueryVariables} />}
    </>
  )
}

export default observer(UserFolderNode)
