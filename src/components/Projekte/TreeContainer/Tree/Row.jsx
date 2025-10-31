import { useContext } from 'react'
import {
  MdExpandMore,
  MdChevronRight,
  MdRemove,
  MdMoreHoriz,
} from 'react-icons/md'
import { observer } from 'mobx-react-lite'
import Highlighter from 'react-highlight-words'
import { useNavigate, useLocation } from 'react-router'
import { upperFirst } from 'es-toolkit'

import { isNodeInActiveNodePath } from '../isNodeInActiveNodePath.js'
import { isNodeOrParentInActiveNodePath } from '../isNodeOrParentInActiveNodePath.js'
import { isNodeOpen } from '../isNodeOpen.js'
import { toggleNode } from './toggleNode.js'
import { toggleNodeSymbol } from './toggleNodeSymbol.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ContextMenuTrigger } from '../../../../modules/react-contextmenu/index.js'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'

import {
  node as nodeClass,
  openNode,
  closedNodeWithChildren,
  loading,
  leaf,
  symbol,
  label as labelClass,
} from './Row.module.css'

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

export const Row = observer(({ node, transitionState, ref }) => {
  const navigate = useNavigate()
  const { search } = useLocation()

  const store = useContext(MobxContext)
  const { openNodes, nodeLabelFilter, activeNodeArray } = store.tree
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
      store,
      navigate,
      search,
      onlyShowActivePath,
    })

  const onClickNodeSymbol = () =>
    toggleNodeSymbol({ node, store, search, navigate })

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
        className={nodeClass}
        style={nodeStyle}
      >
        {useSymbolIcon && (
          <div
            className={symbol}
            onClick={onClickNodeSymbol}
          >
            {symbolIcon === 'openNodeIcon' && (
              <MdExpandMore
                viewBox="4 3 17 17"
                height={23}
                style={{
                  color:
                    nodeIsInActiveNodePath ? '#D84315 !important' : 'inherit',
                }}
                className={openNode}
              />
            )}
            {symbolIcon === 'closedNodeWithChildrenIcon' && (
              <MdChevronRight className={closedNodeWithChildren} />
            )}
            {symbolIcon === 'loadingIcon' && (
              <MdMoreHoriz
                style={{
                  color:
                    nodeIsInActiveNodePath ? '#D84315 !important' : 'inherit',
                }}
                className={loading}
              />
            )}
          </div>
        )}
        {useSymbolSpan && (
          <div
            className={symbol}
            onClick={onClickNode}
          >
            <MdRemove className={leaf} />
          </div>
        )}
        {node.labelLeftElements?.length &&
          node.labelLeftElements.map((El, index) => <El key={index} />)}
        <span
          className={labelClass}
          node={node}
          onClick={onClickNode}
          style={{
            fontWeight: nodeIsInActiveNodePath ? 700 : 'inherit',
            color: nodeIsInActiveNodePath ? '#D84315 !important' : 'inherit',
          }}
        >
          {nodeLabelFilter?.[node.menuType] ?
            <Highlighter
              searchWords={[nodeLabelFilter[node.menuType]]}
              textToHighlight={node.label}
            />
          : node.label}
        </span>
        {node.labelRightElements?.length &&
          node.labelRightElements.map((El, index) => <El key={index} />)}
      </div>
    </ContextMenuTrigger>
  )
})
