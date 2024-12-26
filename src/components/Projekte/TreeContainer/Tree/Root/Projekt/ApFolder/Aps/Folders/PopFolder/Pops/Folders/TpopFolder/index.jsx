import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { Row } from '../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../mobxContext.js'
import { Tpops } from './Tpops/index.jsx'
import { nodeFromMenu } from '../../../../../../../../../nodeFromMenu.js'

// TODO: get rid of having to pass projekt, ap, pop
export const TpopFolder = memo(
  observer(({ projekt, ap, pop, menu }) => {
    const store = useContext(MobxContext)

    const isOpen =
      menu.alwaysOpen ? true : (
        store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
        )
      )

    const node = nodeFromMenu(menu)

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && (
            <Tpops
              projekt={projekt}
              ap={ap}
              pop={pop}
            />
          )}
        </TransitionGroup>
      </>
    )
  }),
)
