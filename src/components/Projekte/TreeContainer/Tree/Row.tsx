import {
  MdExpandMore,
  MdChevronRight,
  MdRemove,
  MdMoreHoriz,
} from 'react-icons/md'
import Highlighter from 'react-highlight-words'
import { useLocation } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRef } from 'react'
import type { Ref } from 'react'
import type { TransitionStatus } from 'react-transition-group'

import { isNodeInActiveNodePath } from '../isNodeInActiveNodePath.ts'
import { isNodeOrParentInActiveNodePath } from '../isNodeOrParentInActiveNodePath.ts'
import { isNodeOpen } from '../isNodeOpen.ts'
import { toggleNode } from './toggleNode.ts'
import { toggleNodeSymbol } from './toggleNodeSymbol.ts'
import {
  treeOpenNodesAtom,
  treeActiveNodeArrayAtom,
  treeNodeLabelFilterAtom,
} from '../../../../store/index.ts'
import {
  treeContextMenuAtom,
  holdToDisplayMs,
  nextMenuOpenId,
} from '../ContextMenu/treeContextMenuAtom.ts'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.ts'
import { prefetchNodeData } from '../../../../modules/prefetchNodeData.ts'
import type { TreeNodeData } from './types.ts'

import styles from './Row.module.css'

const transitionStyles: Partial<
  Record<TransitionStatus, { opacity: number }>
> = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

interface RowProps {
  node: TreeNodeData
  transitionState?: TransitionStatus | undefined
  ref?: Ref<HTMLDivElement> | undefined
}

export const Row = ({ node, transitionState, ref }: RowProps) => {
  const { search } = useLocation()

  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const openTreeContextMenu = useSetAtom(treeContextMenuAtom)

  const nodeIsInActiveNodePath = isNodeInActiveNodePath({
    node,
    activeNodeArray,
  })
  const nodeIsOpen = isNodeOpen({ openNodes, url: node.url })

  const [onlyShowActivePathString] = useSearchParamsState<string>(
    'onlyShowActivePath',
    'false',
  )
  const onlyShowActivePath = onlyShowActivePathString === 'true'

  // only calculate if needed
  const nodeOrParentIsInActivePath =
    onlyShowActivePath ?
      isNodeOrParentInActiveNodePath({ node, activeNodeArray })
    : false

  // build symbols
  let useSymbolIcon = true
  let useSymbolSpan = false
  let symbolIcon: string | undefined
  if (node.hasChildren && (nodeIsOpen || node.alwaysOpen)) {
    symbolIcon = 'openNodeIcon'
  } else if (node.hasChildren) {
    symbolIcon = 'closedNodeWithChildrenIcon'
  } else if (node.label === 'lade Daten...') {
    symbolIcon = 'loadingIcon'
  } else {
    useSymbolSpan = true
    useSymbolIcon = false
  }
  const level =
    node.url[0] === 'Projekte' ? node.url.length - 1 : node.url.length

  const onClickNode = () =>
    toggleNode({
      node,
      search,
      onlyShowActivePath,
    })

  const onClickNodeSymbol = () => toggleNodeSymbol({ node, search })

  const onMouseEnterNode = () => {
    // Prefetch data when hovering over node
    void prefetchNodeData(node)
  }

  // holding the left mouse button (or touch) opens the menu, as before
  const holdToDisplayTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdToDisplayStart = useRef<{ x: number; y: number } | null>(null)
  const clearHoldToDisplay = () => {
    if (holdToDisplayTimer.current) {
      clearTimeout(holdToDisplayTimer.current)
      holdToDisplayTimer.current = null
    }
    holdToDisplayStart.current = null
  }
  const onPointerDownNode = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const start = { x: e.clientX, y: e.clientY }
    holdToDisplayStart.current = start
    holdToDisplayTimer.current = setTimeout(() => {
      openTreeContextMenu({ id: nextMenuOpenId(), node, x: start.x, y: start.y })
    }, holdToDisplayMs)
  }
  const onPointerMoveNode = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = holdToDisplayStart.current
    // moving away means dragging or scrolling, not holding still
    if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 9) {
      clearHoldToDisplay()
    }
  }

  // open the context menu; suppress the browser menu like the former
  // trigger did, also when no menu exists for this menuType
  const onContextMenuNode = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    // keep the menu's own contextmenu listener from closing the new menu
    e.stopPropagation()
    clearHoldToDisplay()
    openTreeContextMenu({
      id: nextMenuOpenId(),
      node,
      x: e.clientX,
      y: e.clientY,
    })
  }

  const labelFilter = nodeLabelFilter?.[node.menuType]

  const nodeStyle = {
    ...(transitionState ? transitionStyles[transitionState] : {}),
    color: nodeIsInActiveNodePath ? '#D84315' : 'inherit',
    paddingLeft: `${Number(level) * 17 - 10}px`,
  }

  if (onlyShowActivePath && !nodeOrParentIsInActivePath) return null

  return (
    <div
      // need this id to scroll elements into view
      id={node.id ?? undefined}
      ref={ref}
      className={styles.node}
      style={nodeStyle}
      onMouseEnter={onMouseEnterNode}
      onContextMenu={onContextMenuNode}
      onPointerDown={onPointerDownNode}
      onPointerMove={onPointerMoveNode}
      onPointerUp={clearHoldToDisplay}
      onPointerCancel={clearHoldToDisplay}
      onPointerLeave={clearHoldToDisplay}
    >
      {useSymbolIcon && (
        <div
          className={styles.symbol}
          onClick={onClickNodeSymbol}
        >
          {symbolIcon === 'openNodeIcon' && (
            <MdExpandMore
              viewBox="4 3 17 17"
              height={23}
              style={{
                color: nodeIsInActiveNodePath ? '#D84315' : 'inherit',
              }}
              className={styles.openNode}
            />
          )}
          {symbolIcon === 'closedNodeWithChildrenIcon' && (
            <MdChevronRight className={styles.closedNodeWithChildren} />
          )}
          {symbolIcon === 'loadingIcon' && (
            <MdMoreHoriz
              style={{
                color: nodeIsInActiveNodePath ? '#D84315' : 'inherit',
              }}
              className={styles.loading}
            />
          )}
        </div>
      )}
      {useSymbolSpan && (
        <div
          className={styles.symbol}
          onClick={onClickNode}
        >
          <MdRemove className={styles.leaf} />
        </div>
      )}
      {node.labelLeftElements?.length &&
        node.labelLeftElements.map((El, index) => <El key={index} />)}
      <span
        className={styles.label}
        {...({ node } as Record<string, unknown>)}
        onClick={onClickNode}
        style={{
          fontWeight: nodeIsInActiveNodePath ? 700 : 'inherit',
          color: nodeIsInActiveNodePath ? '#D84315' : 'inherit',
        }}
      >
        {labelFilter ?
          <Highlighter
            searchWords={[labelFilter]}
            textToHighlight={node.label}
          />
        : node.label
          .split('\n')
          .map((part, index) => <div key={index}>{part}</div>)
        }
      </span>
      {node.labelRightElements?.length &&
        node.labelRightElements.map((El, index) => <El key={index} />)}
    </div>
  )
}
