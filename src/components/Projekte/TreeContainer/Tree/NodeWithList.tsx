import { TransitionGroup } from 'react-transition-group'
import { isEqual } from 'es-toolkit'

import { Row } from './Row.tsx'
import { NodesList } from './NodesList/index.tsx'
import { Folders } from './Folders.tsx'
import { nodeFromMenu } from './nodeFromMenu.ts'
import { checkIfIsOpen } from './checkIfIsOpen.ts'

export const NodeWithList = ({ menu }) => {
  const isOpen = checkIfIsOpen({ menu })
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
}
