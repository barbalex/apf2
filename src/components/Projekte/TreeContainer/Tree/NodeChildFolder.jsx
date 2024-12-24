import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { MobxContext } from '../../../../mobxContext.js'
import {NodeTransitioned} from './NodeTransitioned.jsx'

export const NodeChildFolder = memo(
  observer(({ menu }) => {
    const store = useContext(MobxContext)

    const isOpen = store.tree.openNodes.some((n) =>
      isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
    )


    return (
      <>
        <TransitionGroup component={null}>
          {isOpen && <NodeTransitioned menu={menu} />}
        </TransitionGroup>
      </>
    )
  }),
)
