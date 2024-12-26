import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { Row } from '../../../Row.jsx'
import { MobxContext } from '../../../../../../../mobxContext.js'
import { Aps } from './Aps/index.jsx'
import { nodeFromMenu } from '../../../nodeFromMenu.js'

export const ApFolder = memo(
  observer(({ projekt, menu }) => {
    const store = useContext(MobxContext)

    const isOpen =
      menu.alwaysOpen ? true
      : menu.treeUrl?.length ?
        store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
        )
      : false

    const node = nodeFromMenu(menu)

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && <Aps projekt={projekt} menu={menu} />}
        </TransitionGroup>
      </>
    )
  }),
)
