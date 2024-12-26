import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { Row } from '../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../mobxContext.js'
import { Zieljahrs } from './Zieljahrs.jsx'
import { NodeListFolder } from '../../../../../../NodeListFolder.jsx'
import { nodeFromMenu } from '../../../../../../nodeFromMenu.js'

// TODO: get rid of having to pass projekt, ap
export const ApzieljahrFolder = memo(
  observer(({ projekt, ap, menu }) => {
    const store = useContext(MobxContext)

    const isOpen =
      menu.alwaysOpen ? true : (
        store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
        )
      )

    const node = nodeFromMenu(menu)

    // return <NodeListFolder menu={menu} />

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && (
            <Zieljahrs
              projekt={projekt}
              ap={ap}
              menu={menu}
            />
          )}
        </TransitionGroup>
      </>
    )
  }),
)
