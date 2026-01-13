import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'
import { isEqual } from 'es-toolkit'
import { getSnapshot } from 'mobx-state-tree'

import { Row } from './Row.tsx'
import { MobxContext } from '../../../../mobxContext.js'
import { NodesList } from './NodesList/index.tsx'
import { Folders } from './Folders.tsx'
import { nodeFromMenu } from './nodeFromMenu.js'
import { checkIfIsOpen } from './checkIfIsOpen.js'

export const NodeWithList = observer(({ menu }) => {
  const store = useContext(MobxContext)
  const isOpen = checkIfIsOpen({ store, menu })
  const node = nodeFromMenu(menu)

  return (
    <>
      <Row node={node} />
      {isOpen && (
        <TransitionGroup component={null}>
          {!!menu.childrenAreFolders ?
            <Folders menu={menu} />
          : <NodesList menu={menu} />}
        </TransitionGroup>
      )}
    </>
  )
})
