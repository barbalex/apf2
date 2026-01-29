import {
  MdExpandMore,
  MdChevronRight,
  MdRemove,
  MdMoreHoriz,
} from 'react-icons/md'
import Highlighter from 'react-highlight-words'
import { useLocation } from 'react-router'
import { upperFirst } from 'es-toolkit'
import { useAtomValue } from 'jotai'

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
import { ContextMenuTrigger } from '../../../../modules/react-contextmenu/index.ts'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.ts'
import { prefetchNodeData } from '../../../../modules/prefetchNodeData.ts'

import styles from './Row.module.css'

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

export const Row = ({ node, transitionState, ref }) => {
  const { search } = useLocation()

  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const activeId = activeNodeArray[activeNodeArray.length - 1]
  const nodeIsActive = node.id === activeId

  const nodeIsInActiveNodePath = isNodeInActiveNodePath({
    node,
    activeNodeArray,
  })
  const nodeIsOpen = isNodeOpen({ openNodes, url: node.url })

  const [onlyShowActivePathString] = useSearchParamsState(
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
  let symbolIcon
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
  const dataUrl = JSON.stringify(node.url)
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
    prefetchNodeData(node)
  }

  const nodeStyle = {
    ...(transitionState ? transitionStyles[transitionState] : {}),
    color: nodeIsInActiveNodePath ? '#D84315' : 'inherit',
    paddingLeft: `${Number(level) * 17 - 10}px`,
  }

  if (onlyShowActivePath && !nodeOrParentIsInActivePath) return null

  return (
    <ContextMenuTrigger
      // need this id for the menu to work
      id={`tree${upperFirst(node.menuType)}`}
      collect={(props) => props}
      nodeId={node.id}
      tableId={node.tableId}
      nodeLabel={node.label}
    >
      <div
        data-id={node.tableId || node.id}
        data-parentid={node.parentTableId || node.parentId}
        data-url={dataUrl}
        data-nodetype={node.nodeType}
        data-label={node.label}
        data-menutype={node.menuType}
        data-singleelementname={node.singleElementName}
        data-jahr={node.jahr}
        // need this id to scroll elements into view
        id={node.id}
        ref={ref}
        className={styles.node}
        style={nodeStyle}
        onMouseEnter={onMouseEnterNode}
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
          node={node}
          onClick={onClickNode}
          style={{
            fontWeight: nodeIsInActiveNodePath ? 700 : 'inherit',
            color: nodeIsInActiveNodePath ? '#D84315' : 'inherit',
          }}
        >
          {nodeLabelFilter?.[node.menuType] ?
            <Highlighter
              searchWords={[nodeLabelFilter[node.menuType]]}
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
    </ContextMenuTrigger>
  )
}
