import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../Row.jsx'
import { MobxContext } from '../../../../../mobxContext.js'
import { Users } from './Users.jsx'
import { useUsersNavData } from '../../../../../modules/useUsersNavData.js'
import { nodeFromMenu } from '../nodeFromMenu.js'
import { checkIfIsOpen } from '../checkIfIsOpen.js'
import { NodeWithList } from '../NodeWithList.jsx'
import { is } from 'date-fns/locale'

export const UsersFolder = memo(
  observer(({ count, countFiltered, isLoading, usersFilter }) => {
    const store = useContext(MobxContext)

    const { navData } = useUsersNavData()

    const node = nodeFromMenu(navData)
    const isOpen = checkIfIsOpen({ store, menu: navData })

    return <NodeWithList menu={navData} />

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
