import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../Row.jsx'
import { StoreContext } from '../../../../../../storeContext.js'
import { Users } from './Users.jsx'

export const UsersFolder = memo(
  observer(({ count, countFiltered, isLoading, usersFilter }) => {
    const store = useContext(StoreContext)

    const node = {
      nodeType: 'folder',
      menuType: 'userFolder',
      id: 'benutzerFolder',
      urlLabel: 'Benutzer',
      label: `Benutzer (${isLoading ? '...' : `${countFiltered}/${count}`})`,
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
  }),
)
