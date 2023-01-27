import React, { useContext, useCallback } from 'react'
import styled from '@emotion/styled'
import {
  MdLocalFlorist,
  MdSwapVerticalCircle,
  MdExpandMore,
  MdContentCopy,
  MdPhotoLibrary,
  MdChevronRight,
  MdRemove,
  MdMoreHoriz,
  MdPictureAsPdf,
} from 'react-icons/md'
import { observer } from 'mobx-react-lite'
import Highlighter from 'react-highlight-words'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import upperFirst from 'lodash/upperFirst'

import isNodeInActiveNodePath from '../isNodeInActiveNodePath'
import isNodeOpen from '../isNodeOpen'
import toggleNode from './toggleNode'
import toggleNodeSymbol from './toggleNodeSymbol'
import storeContext from '../../../../storeContext'
import { ContextMenuTrigger } from 'react-contextmenu/dist/react-contextmenu'
import useSearchParamsState from '../../../../modules/useSearchParamsState'
import isMobilePhone from '../../../../modules/isMobilePhone'

const PrintIcon = styled(MdPictureAsPdf)`
  font-size: 1.5rem;
`
const singleRowHeight = 23
const StyledNode = styled.div`
  padding-left: ${(props) => `${Number(props['data-level']) * 17 - 10}px`};
  height: ${singleRowHeight}px;
  max-height: ${singleRowHeight}px;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  user-select: none;
  color: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '#D84315' : 'inherit'};
`
const StyledExpandMoreIcon = styled(MdExpandMore)`
  margin-top: ${(props) =>
    props['data-nodeisopen'] ? '-6px !important' : '1px !important'};
  margin-left: ${(props) => (props['data-nodeisopen'] ? '-1px !important' : 0)};
  margin-right: ${(props) =>
    props['data-nodeisopen'] ? '-5px !important' : 0};
  padding-left: ${(props) => (props['data-nodeisopen'] ? '2px' : '2px')};
  height: ${(props) =>
    props['data-nodeisopen'] ? '30px !important' : '22px !important'};
  width: ${(props) =>
    props['data-nodeisopen'] ? '30px !important' : '26px !important'};
  color: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '#D84315 !important' : 'inherit'};
  cursor: pointer;
  &:hover {
    color: #f57c00 !important;
  }
`
const StyledChevronRightIcon = styled(MdChevronRight)`
  padding-left: 2px;
  height: 22px !important;
  width: 26px;
  cursor: pointer;
  font-size: 1.5rem;
  &:hover {
    color: #f57c00 !important;
  }
`
const StyledMoreHorizIcon = styled(MdMoreHoriz)`
  margin-top: ${(props) =>
    props['data-nodeisinactivenodepath']
      ? '-5px !important'
      : '-2px !important'};
  padding-left: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '1px' : '2px'};
  height: ${(props) =>
    props['data-nodeisinactivenodepath']
      ? '26px !important'
      : '22px !important'};
  color: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '#D84315 !important' : 'inherit'};
  font-size: 1.5rem;
  width: 26px;
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
  cursor: pointer;
  width: 28px;
`
const TextSpan = styled.span`
  margin-left: 0;
  padding-right: 5px;
  font-size: 16px !important;
  font-weight: ${(props) =>
    props['data-nodeisinactivenodepath'] ? '700 !important' : 'inherit'};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden !important;
  cursor: pointer;
  &:hover {
    color: #f57c00;
  }
`
const StyledMapIcon = styled(MdLocalFlorist)`
  padding-right: 2px;
  margin-left: -2px;
  height: 20px !important;
  font-size: 1.4rem;
`
const PopMapIcon = styled(StyledMapIcon)`
  color: #947500 !important;
`
const TpopMapIcon = styled(StyledMapIcon)`
  color: #016f19 !important;
`
const BeobNichtBeurteiltMapIcon = styled(StyledMapIcon)`
  color: #9a009a !important;
`
const BeobNichtZuzuordnenMapIcon = styled(StyledMapIcon)`
  color: #ffe4ff !important;
`
const BeobZugeordnetMapIcon = styled(StyledMapIcon)`
  color: #ff00ff !important;
`
const PopFilteredMapIcon = styled(PopMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
const TpopFilteredMapIcon = styled(TpopMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
const BeobNichtBeurteiltFilteredMapIcon = styled(BeobNichtBeurteiltMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
const BeobNichtZuzuordnenFilteredMapIcon = styled(BeobNichtZuzuordnenMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
const BeobZugeordnetFilteredMapIcon = styled(BeobZugeordnetMapIcon)`
  paint-order: stroke;
  stroke-width: 8px;
  stroke: #fff900;
`
const MovingIcon = styled(MdSwapVerticalCircle)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
  font-size: 1.5rem;
`
const CopyingIcon = styled(MdContentCopy)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
  font-size: 1.5rem;
`
const BiotopCopyingIcon = styled(MdPhotoLibrary)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
  font-size: 1.5rem;
`
const PrintIconContainer = styled.div`
  cursor: pointer;
  padding-left: 8px;
  svg {
    font-size: 19px !important;
  }
  &:hover {
    svg {
      font-size: 22px !important;
    }
  }
`

const Row = ({ node }) => {
  const { apId, tpopId } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()

  const store = useContext(storeContext)
  const {
    activeApfloraLayers,
    copying,
    moving,
    copyingBiotop,
    setPrintingJberYear,
  } = store
  const tree = store.tree
  const { openNodes, nodeLabelFilter, activeNodeArray } = tree
  const activeId = activeNodeArray[activeNodeArray.length - 1]
  const nodeIsActive = node.id === activeId

  const nodeIsInActiveNodePath = isNodeInActiveNodePath({
    node,
    activeNodeArray,
  })
  const nodeIsOpen = isNodeOpen({ openNodes, url: node.url })
  // build symbols
  let useSymbolIcon = true
  let useSymbolSpan = false
  let symbolIcon
  let showPrintIcon = false
  if (node.hasChildren && nodeIsOpen) {
    symbolIcon = 'expandMore'
  } else if (node.hasChildren) {
    symbolIcon = 'chevronRight'
  } else if (node.label === 'lade Daten...') {
    symbolIcon = 'moreHoriz'
  } else {
    useSymbolSpan = true
    useSymbolIcon = false
  }
  if (node.menuType === 'apber' || node.menuType === 'apberuebersicht') {
    showPrintIcon = true
  }
  const printIconTitle =
    node.menuType === 'apberuebersicht'
      ? 'Druckversion. Achtung: braucht Minuten, um vollständig zu laden'
      : 'Druckversion'
  const dataUrl = JSON.stringify(node.url)
  const level =
    node.url[0] === 'Projekte' ? node.url.length - 1 : node.url.length
  const isMoving =
    node.nodeType === 'table' &&
    node.menuType === moving.table &&
    node.id === moving.id
  const isCopying =
    node.nodeType === 'table' &&
    node.menuType === copying.table &&
    node.id === copying.id
  const amCopyingBiotop =
    node.nodeType === 'table' && node.id === copyingBiotop.id

  const onClickNode = useCallback(() => {
    toggleNode({
      node,
      store,
      navigate,
      search,
    })
  }, [navigate, node, search, store])

  const onClickNodeSymbol = useCallback(() => {
    toggleNodeSymbol({ node, store, search, navigate })
  }, [navigate, node, search, store])

  const onClickPrint = useCallback(() => {
    setPrintingJberYear(+node.label)
    navigate(`/Daten/${[...node.url, 'print'].join('/')}${search}`)
  }, [navigate, node.label, node.url, search, setPrintingJberYear])

  const [projekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )
  const karteIsVisible = projekteTabs.includes('karte')

  return (
    <ContextMenuTrigger
      id={`tree${upperFirst(node.menuType)}`}
      //collect={(props) => ({ key: index })}
      collect={(props) => props}
      nodeId={node.id}
      tableId={node.tableId}
      nodeLabel={node.label}
      key={`${node.menuType}${node.id}`}
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
      >
        {useSymbolIcon && (
          <SymbolDiv onClick={onClickNodeSymbol}>
            {symbolIcon === 'expandMore' && (
              <StyledExpandMoreIcon
                data-nodeisinactivenodepath={nodeIsInActiveNodePath}
                data-nodeisopen={nodeIsOpen}
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
        {karteIsVisible && (
          <>
            {node.menuType === 'ap' &&
              node.id === apId &&
              activeApfloraLayers.includes('pop') && (
                <div title="in Karte sichtbar">
                  <PopMapIcon />
                </div>
              )}
            {node.menuType === 'ap' &&
              node.id === apId &&
              activeApfloraLayers.includes('tpop') && (
                <div title="in Karte sichtbar">
                  <TpopMapIcon />
                </div>
              )}
            {node.menuType === 'beobNichtBeurteiltFolder' &&
              node.id === apId &&
              activeApfloraLayers.includes('beobNichtBeurteilt') && (
                <div title="in Karte sichtbar">
                  <BeobNichtBeurteiltMapIcon />
                </div>
              )}
            {node.menuType === 'beobNichtZuzuordnenFolder' &&
              node.id === apId &&
              activeApfloraLayers.includes('beobNichtZuzuordnen') && (
                <div title="in Karte sichtbar">
                  <BeobNichtZuzuordnenMapIcon />
                </div>
              )}
            {node.menuType === 'beobZugeordnetFolder' &&
              node.id === tpopId &&
              activeApfloraLayers.includes('beobZugeordnet') && (
                <div title="in Karte sichtbar">
                  <BeobZugeordnetMapIcon />
                </div>
              )}
            {node.menuType === 'pop' &&
              activeApfloraLayers.includes('pop') &&
              !nodeIsActive && (
                <div title="in Karte sichtbar">
                  <PopMapIcon />
                </div>
              )}
            {node.menuType === 'pop' &&
              activeApfloraLayers.includes('pop') &&
              nodeIsActive && (
                <div title="in Karte hervorgehoben">
                  <PopFilteredMapIcon />
                </div>
              )}
            {node.menuType === 'tpop' &&
              activeApfloraLayers.includes('tpop') &&
              !nodeIsActive && (
                <div title="in Karte sichtbar">
                  <TpopMapIcon />
                </div>
              )}
            {node.menuType === 'tpop' &&
              activeApfloraLayers.includes('tpop') &&
              nodeIsActive && (
                <div title="in Karte hervorgehoben">
                  <TpopFilteredMapIcon />
                </div>
              )}
            {node.menuType === 'beobNichtBeurteilt' &&
              activeApfloraLayers.includes('beobNichtBeurteilt') &&
              !nodeIsActive && (
                <div title="in Karte sichtbar">
                  <BeobNichtBeurteiltMapIcon />
                </div>
              )}
            {node.menuType === 'beobNichtBeurteilt' &&
              activeApfloraLayers.includes('beobNichtBeurteilt') &&
              nodeIsActive && (
                <div title="in Karte hervorgehoben">
                  <BeobNichtBeurteiltFilteredMapIcon />
                </div>
              )}
            {node.menuType === 'beobNichtZuzuordnen' &&
              activeApfloraLayers.includes('beobNichtZuzuordnen') &&
              !nodeIsActive && (
                <div title="in Karte sichtbar">
                  <BeobNichtZuzuordnenMapIcon />
                </div>
              )}
            {node.menuType === 'beobNichtZuzuordnen' &&
              activeApfloraLayers.includes('beobNichtZuzuordnen') &&
              nodeIsActive && (
                <div title="in Karte hervorgehoben">
                  <BeobNichtZuzuordnenFilteredMapIcon />
                </div>
              )}
            {activeApfloraLayers.includes('beobZugeordnet') &&
              node.menuType === 'beobZugeordnet' &&
              !nodeIsActive && (
                <div title="in Karte sichtbar">
                  <BeobZugeordnetMapIcon />
                </div>
              )}
            {activeApfloraLayers.includes('beobZugeordnet') &&
              node.menuType === 'beobZugeordnet' &&
              nodeIsActive && (
                <div title="in Karte hervorgehoben">
                  <BeobZugeordnetFilteredMapIcon />
                </div>
              )}
          </>
        )}
        <TextSpan
          data-nodeisinactivenodepath={nodeIsInActiveNodePath}
          node={node}
          onClick={onClickNode}
        >
          {nodeLabelFilter?.[node.menuType] ? (
            <Highlighter
              searchWords={[nodeLabelFilter[node.menuType]]}
              textToHighlight={node.label}
            />
          ) : (
            node.label
          )}
        </TextSpan>
        {isMoving && (
          <div title="zum Verschieben gemerkt, bereit zum Einfügen">
            <MovingIcon />
          </div>
        )}
        {isCopying && (
          <div title="kopiert, bereit zum Einfügen">
            <CopyingIcon />
          </div>
        )}
        {amCopyingBiotop && (
          <div title="Biotop kopiert, bereit zum Einfügen">
            <BiotopCopyingIcon />
          </div>
        )}
        {showPrintIcon && (
          <PrintIconContainer title={printIconTitle} onClick={onClickPrint}>
            <PrintIcon />
          </PrintIconContainer>
        )}
      </StyledNode>
    </ContextMenuTrigger>
  )
}

export default observer(Row)
