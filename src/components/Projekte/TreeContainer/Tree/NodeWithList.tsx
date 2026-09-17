import { TransitionGroup } from 'react-transition-group'
import { useAtomValue } from 'jotai'
import type { TransitionStatus } from 'react-transition-group'

import { Row } from './Row.tsx'
import { NodesList } from './NodesList/index.tsx'
import { Folders } from './Folders.tsx'
import { nodeFromMenu } from './nodeFromMenu.ts'
import { checkIfIsOpen } from './checkIfIsOpen.ts'
import { treeOpenNodesAtom } from '../../../../store/index.ts'
import type { TreeMenu } from './types.ts'

interface NodeWithListProps {
  menu: TreeMenu
  // passed by Fetcher for nodes without transitions but not used here
  parentTransitionState?: TransitionStatus | undefined
}

export const NodeWithList = ({ menu }: NodeWithListProps) => {
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const isOpen = checkIfIsOpen({ menu, openNodes })
  const node = nodeFromMenu(menu)

  return (
    <>
      <Row node={node} />
      {isOpen && (
        <TransitionGroup component={null}>
          {menu.childrenAreFolders ?
            <Folders menu={menu} />
          : <NodesList menu={menu} />}
        </TransitionGroup>
      )}
    </>
  )
}
