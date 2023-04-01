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
import { ReactComponent as SVG100 } from '../../Karte/layers/Tpop/statusGroupSymbols/100.svg'
import { ReactComponent as SVG100Highlighted } from '../../Karte/layers/Tpop/statusGroupSymbols/100_highlighted.svg'
import { ReactComponent as SVG101 } from '../../Karte/layers/Tpop/statusGroupSymbols/101.svg'
import { ReactComponent as SVG101Highlighted } from '../../Karte/layers/Tpop/statusGroupSymbols/101_highlighted.svg'
import { ReactComponent as SVG200 } from '../../Karte/layers/Tpop/statusGroupSymbols/200.svg'
import { ReactComponent as SVG200Highlighted } from '../../Karte/layers/Tpop/statusGroupSymbols/200_highlighted.svg'
import { ReactComponent as SVG201 } from '../../Karte/layers/Tpop/statusGroupSymbols/201.svg'
import { ReactComponent as SVG201Highlighted } from '../../Karte/layers/Tpop/statusGroupSymbols/201_highlighted.svg'
import { ReactComponent as SVG202 } from '../../Karte/layers/Tpop/statusGroupSymbols/202.svg'
import { ReactComponent as SVG202Highlighted } from '../../Karte/layers/Tpop/statusGroupSymbols/202_highlighted.svg'
import { ReactComponent as SVG300 } from '../../Karte/layers/Tpop/statusGroupSymbols/300.svg'
import { ReactComponent as SVG300Highlighted } from '../../Karte/layers/Tpop/statusGroupSymbols/300_highlighted.svg'
import { ReactComponent as TpopIcon } from '../../Karte/layers/Tpop/tpop.svg'
import { ReactComponent as TpopIconHighlighted } from '../../Karte/layers/Tpop/tpopHighlighted.svg'
import { ReactComponent as UIcon } from '../../Karte/layers/Tpop/statusGroup/u.svg'
import { ReactComponent as UIconHighlighted } from '../../Karte/layers/Tpop/statusGroup/uHighlighted.svg'
import { ReactComponent as AIcon } from '../../Karte/layers/Tpop/statusGroup/a.svg'
import { ReactComponent as AIconHighlighted } from '../../Karte/layers/Tpop/statusGroup/aHighlighted.svg'
import { ReactComponent as PIcon } from '../../Karte/layers/Tpop/statusGroup/p.svg'
import { ReactComponent as PIconHighlighted } from '../../Karte/layers/Tpop/statusGroup/pHighlighted.svg'
import { ReactComponent as QIcon } from '../../Karte/layers/Tpop/statusGroup/q.svg'
import { ReactComponent as QIconHighlighted } from '../../Karte/layers/Tpop/statusGroup/qHighlighted.svg'

const tpopIcons = {
  normal: {
    100: TpopIcon,
    '100Highlighted': TpopIconHighlighted,
    101: TpopIcon,
    '101Highlighted': TpopIconHighlighted,
    200: TpopIcon,
    '200Highlighted': TpopIconHighlighted,
    201: TpopIcon,
    '201Highlighted': TpopIconHighlighted,
    202: TpopIcon,
    '202Highlighted': TpopIconHighlighted,
    300: TpopIcon,
    '300Highlighted': TpopIconHighlighted,
  },
  statusGroup: {
    100: UIcon,
    '100Highlighted': UIconHighlighted,
    101: UIcon,
    '101Highlighted': UIconHighlighted,
    200: AIcon,
    '200Highlighted': AIconHighlighted,
    201: AIcon,
    '201Highlighted': AIconHighlighted,
    202: AIcon,
    '202Highlighted': AIconHighlighted,
    300: PIcon,
    '300Highlighted': PIconHighlighted,
  },
  statusGroupSymbols: {
    100: SVG100,
    '100Highlighted': SVG100Highlighted,
    101: SVG101,
    '101Highlighted': SVG101Highlighted,
    200: SVG200,
    '200Highlighted': SVG200Highlighted,
    201: SVG201,
    '201Highlighted': SVG201Highlighted,
    202: SVG202,
    '202Highlighted': SVG202Highlighted,
    300: SVG300,
    '300Highlighted': SVG300Highlighted,
  },
}

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
const IconContainer = styled.div`
  padding-right: 4px;
  margin-left: -2px;
  font-size: 1.1rem;
`

const Row = ({ node }) => {
  const { apId, tpopId } = useParams()
  const navigate = useNavigate()
  const { search } = useLocation()

  // console.log('Row, node:', node)

  const store = useContext(storeContext)
  const {
    activeApfloraLayers,
    copying,
    moving,
    copyingBiotop,
    setPrintingJberYear,
    map,
  } = store
  const tree = store.tree
  const { openNodes, nodeLabelFilter, activeNodeArray } = tree
  const { tpopIcon: tpopIconName } = map
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

  const iconIsHighlighted =
    karteIsVisible && activeApfloraLayers.includes('tpop') && nodeIsActive
  const TpopIcon = node.status
    ? iconIsHighlighted
      ? tpopIcons[tpopIconName][node.status + 'Highlighted']
      : tpopIcons[tpopIconName][node.status]
    : iconIsHighlighted
    ? QIconHighlighted
    : QIcon

  // console.log('Row, node:', node)

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
        data-jahr={node.jahr}
        // need this id to scroll elements into view
        id={node.id}
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
        {node.menuType === 'tpop' && node.status && (
          <IconContainer>
            <TpopIcon />
          </IconContainer>
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
            {/* {node.menuType === 'tpop' &&
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
              )} */}
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
