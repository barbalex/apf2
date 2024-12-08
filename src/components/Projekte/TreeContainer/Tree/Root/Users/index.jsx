import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../Row.jsx'
import { MobxContext } from '../../../../../../mobxContext.js'
import { Users } from './Users.jsx'

export const UsersFolder = memo(
  observer(({ count, countFiltered, isLoading, usersFilter }) => {
    const store = useContext(MobxContext)

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
        <TransitionGroup component={null}>
          {isOpen && <Users usersFilter={usersFilter} />}
        </TransitionGroup>
      </>
    )
  }),
)
