import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'
import { getSnapshot } from 'mobx-state-tree'

import { Row } from './Row.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { NodesList } from './NodesList/index.jsx'
import { Folders } from './Folders.jsx'
import { nodeFromMenu } from './nodeFromMenu.js'
import { checkIfIsOpen } from './checkIfIsOpen.js'

export const NodeWithList = memo(
  observer(({ menu }) => {
    const store = useContext(MobxContext)

    // const isOpen = checkIfIsOpen({ store, menu })
    const isOpen =
      menu.alwaysOpen ??
      store.tree.openNodes.some((n) =>
        isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
      )

    const node = nodeFromMenu(menu)

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <TransitionGroup component={null}>
            {!!menu.childrenAreFolders ? (
              <Folders menu={menu} />
            ) : (
              <NodesList menu={menu} />
            )}
          </TransitionGroup>
        )}
      </>
    )
  }),
)
