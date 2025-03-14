import { memo, useContext, useCallback } from 'react'
import {
  MdExpandMore,
  MdChevronRight,
  MdRemove,
  MdMoreHoriz,
} from 'react-icons/md'
import { observer } from 'mobx-react-lite'
import Highlighter from 'react-highlight-words'
import { useNavigate, useLocation } from 'react-router'
import upperFirst from 'lodash/upperFirst'
import styled from '@emotion/styled'

import { isNodeInActiveNodePath } from '../isNodeInActiveNodePath.js'
import { isNodeOrParentInActiveNodePath } from '../isNodeOrParentInActiveNodePath.js'
import { isNodeOpen } from '../isNodeOpen.js'
import { toggleNode } from './toggleNode.js'
import { toggleNodeSymbol } from './toggleNodeSymbol.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ContextMenuTrigger } from '../../../../modules/react-contextmenu/index.js'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'

const StyledNode = styled.div`
  padding-left: ${(props) => `${Number(props['data-level']) * 17 - 10}px`};
  box-sizing: border-box;
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  user-select: none;
  color: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '#D84315' : 'inherit'};
  content-visibility: auto;
  contain-intrinsic-size: auto 23px;
  transition: opacity 300ms ease-in-out;
  // a child .iconContainer needs some love
  .iconContainer {
    align-self: flex-start !important;
    margin-top: 3px !important;
  }
`
const StyledExpandMoreIcon = styled(MdExpandMore)`
  color: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '#D84315 !important' : 'inherit'};
  cursor: pointer;
  font-size: 1.1rem;
  &:hover {
    color: #f57c00 !important;
  }
`
const StyledChevronRightIcon = styled(MdChevronRight)`
  cursor: pointer;
  font-size: 1.5rem;
  &:hover {
    color: #f57c00 !important;
  }
`
const StyledMoreHorizIcon = styled(MdMoreHoriz)`
  color: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '#D84315 !important' : 'inherit'};
  font-size: 1.5rem;
  cursor: pointer;
  &:hover {
    color: #f57c00 !important;
  }
`
const StyledRemoveIcon = styled(MdRemove)`
  padding-left: 6px;
  padding-right: 2px;
  height: 22px !important;
  width: 16px !important;
  font-size: 1.5rem;
`
const SymbolDiv = styled.div`
  flex-basis: 23px;
  flex-grow: 0;
  flex-shrink: 0;
  cursor: pointer;
  align-self: flex-start;
  svg {
    display: block;
    margin: auto;
  }
`
const TextSpan = styled.span`
  margin-left: 0;
  padding-right: 5px;
  font-size: 16px !important;
  font-weight: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '700 !important' : 'inherit'};
  // line-height: 23px;
  white-space: normal;
  text-overflow: ellipsis;
  overflow: hidden !important;
  cursor: pointer;
  &:hover {
    color: #f57c00;
  }
`

export const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

export const Row = memo(
  observer(({ node, transitionState, ref }) => {
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
      symbolIcon = 'expandMore'
    } else if (node.hasChildren) {
      symbolIcon = 'chevronRight'
    } else if (node.label === 'lade Daten...') {
      symbolIcon = 'moreHoriz'
    } else {
      useSymbolSpan = true
      useSymbolIcon = false
    }
    const dataUrl = JSON.stringify(node.url)
    const level =
      node.url[0] === 'Projekte' ? node.url.length - 1 : node.url.length

    const onClickNode = useCallback(
      () =>
        toggleNode({
          node,
          store,
          navigate,
          search,
          onlyShowActivePath,
        }),
      [navigate, node, search, store, onlyShowActivePath],
    )

    const onClickNodeSymbol = useCallback(
      () => toggleNodeSymbol({ node, store, search, navigate }),
      [navigate, node, search, store],
    )

    // console.log('Row, node:', node)

    if (onlyShowActivePath && !nodeOrParentIsInActivePath) return null

    return (
      <ContextMenuTrigger
        // need this id for the menu to work
        id={`tree${upperFirst(node.menuType)}`}
        //collect={(props) => ({ key: index })}
        collect={(props) => props}
        nodeId={node.id}
        tableId={node.tableId}
        nodeLabel={node.label}
      >
        <StyledNode
          data-level={level}
          data-nodeisinactivenodepath={nodeIsInActiveNodePath}
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
          style={transitionState ? transitionStyles[transitionState] : {}}
        >
          {useSymbolIcon && (
            <SymbolDiv onClick={onClickNodeSymbol}>
              {symbolIcon === 'expandMore' && (
                <StyledExpandMoreIcon
                  data-nodeisinactivenodepath={nodeIsInActiveNodePath}
                  viewBox="4 3 17 17"
                  height={23}
                />
              )}
              {symbolIcon === 'chevronRight' && <StyledChevronRightIcon />}
              {symbolIcon === 'moreHoriz' && (
                <StyledMoreHorizIcon
                  data-nodeisinactivenodepath={nodeIsInActiveNodePath}
                />
              )}
            </SymbolDiv>
          )}
          {useSymbolSpan && (
            <SymbolDiv onClick={onClickNode}>
              <StyledRemoveIcon />
            </SymbolDiv>
          )}
          {node.labelLeftElements?.length &&
            node.labelLeftElements.map((El, index) => <El key={index} />)}
          <TextSpan
            data-nodeisinactivenodepath={nodeIsInActiveNodePath}
            node={node}
            onClick={onClickNode}
          >
            {nodeLabelFilter?.[node.menuType] ?
              <Highlighter
                searchWords={[nodeLabelFilter[node.menuType]]}
                textToHighlight={node.label}
              />
            : node.label}
          </TextSpan>
          {node.labelRightElements?.length &&
            node.labelRightElements.map((El, index) => <El key={index} />)}
        </StyledNode>
      </ContextMenuTrigger>
    )
  }),
)
