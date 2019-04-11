import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { ContextMenuTrigger } from 'react-contextmenu'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
//import PrintIcon from '@material-ui/icons/LibraryBooks'
import PrintIcon from '@material-ui/icons/PictureAsPdf'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'

import isNodeInActiveNodePath from '../isNodeInActiveNodePath'
import isNodeOpen from '../isNodeOpen'
import toggleNode from '../toggleNode'
import toggleNodeSymbol from '../toggleNodeSymbol'
import storeContext from '../../../../storeContext'

const singleRowHeight = 23
const StyledNode = styled.div`
  padding-left: ${props => `${Number(props['data-level']) * 17 - 10}px`};
  height: ${singleRowHeight}px;
  max-height: ${singleRowHeight}px;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  user-select: none;
  color: ${props =>
    props['data-nodeisinactivenodepath'] ? '#D84315' : 'inherit'};
`
const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  margin-top: ${props =>
    props['data-nodeisopen'] ? '-6px !important' : '1px !important'};
  margin-left: ${props => (props['data-nodeisopen'] ? '-1px !important' : 0)};
  margin-right: ${props => (props['data-nodeisopen'] ? '-5px !important' : 0)};
  padding-left: ${props => (props['data-nodeisopen'] ? '2px' : '2px')};
  height: ${props =>
    props['data-nodeisopen'] ? '30px !important' : '22px !important'};
  width: ${props =>
    props['data-nodeisopen'] ? '30px !important' : '26px !important'};
  color: ${props =>
    props['data-nodeisinactivenodepath'] ? '#D84315 !important' : 'inherit'};
  cursor: pointer;
  &:hover {
    color: #f57c00 !important;
  }
`
const StyledChevronRightIcon = styled(ChevronRightIcon)`
  margin-top: -2px !important;
  padding-left: 2px;
  height: 22px !important;
  width: 26px;
  cursor: pointer;
  &:hover {
    color: #f57c00 !important;
  }
`
const StyledMoreHorizIcon = styled(MoreHorizIcon)`
  margin-top: ${props =>
    props['data-nodeisinactivenodepath']
      ? '-5px !important'
      : '-2px !important'};
  padding-left: ${props =>
    props['data-nodeisinactivenodepath'] ? '1px' : '2px'};
  height: ${props =>
    props['data-nodeisinactivenodepath']
      ? '26px !important'
      : '22px !important'};
  color: ${props =>
    props['data-nodeisinactivenodepath'] ? '#D84315 !important' : 'inherit'};
  width: 26px;
  cursor: pointer;
  &:hover {
    color: #f57c00 !important;
  }
`
const SymbolDiv = styled.div`
  cursor: pointer;
`
const SymbolSpan = styled.span`
  padding-right: 8px !important;
  padding-left: ${props =>
    props['data-nodeisinactivenodepath'] ? '7px' : '9px'};
  font-weight: ${props =>
    props['data-nodeisinactivenodepath'] ? '900 !important' : 'inherit'};
  margin-top: -9px !important;
  font-size: 28px !important;
  width: 9px;
`
const TextSpan = styled.span`
  margin-left: 0;
  font-size: 16px !important;
  font-weight: ${props =>
    props['data-nodeisinactivenodepath'] ? '900 !important' : 'inherit'};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden !important;
  cursor: pointer;
  &:hover {
    color: #f57c00;
  }
`
const StyledMapIcon = styled(LocalFloristIcon)`
  padding-right: 2px;
  margin-left: -2px;
  height: 20px !important;
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
const MovingIcon = styled(SwapVerticalCircleIcon)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
`
const CopyingIcon = styled(FileCopyIcon)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
`
const BiotopCopyingIcon = styled(PhotoLibraryIcon)`
  padding-left: 0.2em;
  height: 20px !important;
  color: rgb(255, 90, 0) !important;
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

const Row = ({ index, style, node, treeName }) => {
  const store = useContext(storeContext)
  const {
    activeApfloraLayers,
    copying,
    moving,
    copyingBiotop,
    setTreeKey,
  } = store
  const tree = store[treeName]
  const { openNodes } = tree
  const activeNodes = store[`${treeName}ActiveNodes`]
  const { idsFiltered: mapIdsFiltered } = store[treeName].map

  const activeNodeArray = get(store, `${treeName}.activeNodeArray`)
  const myProps = { key: index }
  const nodeIsInActiveNodePath = isNodeInActiveNodePath(node, activeNodeArray)
  const nodeIsOpen = isNodeOpen(openNodes, node.url)
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
  if (
    (node.menuType === 'apber' || node.menuType === 'apberuebersicht') &&
    tree.name === 'tree'
  ) {
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

  const onClickNode = useCallback(
    event => {
      toggleNode({
        treeName,
        node,
        store,
      })
    },
    [treeName, node],
  )
  const onClickNodeSymbol = useCallback(
    event => {
      toggleNodeSymbol({ treeName, node, store })
    },
    [treeName, node],
  )
  const onClickPrint = useCallback(
    () =>
      setTreeKey({
        value: [...node.url, 'print'],
        tree: treeName,
        key: 'activeNodeArray',
      }),
    [node.url, treeName],
  )

  return (
    <div style={style}>
      <ContextMenuTrigger
        id={`${treeName}${node.menuType}`}
        collect={props => myProps}
        nodeId={node.id}
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
            <SymbolSpan data-nodeisinactivenodepath={nodeIsInActiveNodePath}>
              {'-'}
            </SymbolSpan>
          )}
          {node.menuType === 'ap' &&
            node.id === activeNodes.ap &&
            activeApfloraLayers.includes('pop') && (
              <div title="in Karte sichtbar">
                <PopMapIcon />
              </div>
            )}
          {node.menuType === 'ap' &&
            node.id === activeNodes.ap &&
            activeApfloraLayers.includes('tpop') && (
              <div title="in Karte sichtbar">
                <TpopMapIcon />
              </div>
            )}
          {node.menuType === 'beobNichtBeurteiltFolder' &&
            node.id === activeNodes.ap &&
            activeApfloraLayers.includes('beobNichtBeurteilt') && (
              <div title="in Karte sichtbar">
                <BeobNichtBeurteiltMapIcon />
              </div>
            )}
          {node.menuType === 'beobNichtZuzuordnenFolder' &&
            node.id === activeNodes.ap &&
            activeApfloraLayers.includes('beobNichtZuzuordnen') && (
              <div title="in Karte sichtbar">
                <BeobNichtZuzuordnenMapIcon />
              </div>
            )}
          {node.menuType === 'beobZugeordnetFolder' &&
            node.id === activeNodes.tpop &&
            activeApfloraLayers.includes('beobZugeordnet') && (
              <div title="in Karte sichtbar">
                <BeobZugeordnetMapIcon />
              </div>
            )}
          {node.menuType === 'pop' &&
            activeApfloraLayers.includes('pop') &&
            !mapIdsFiltered.includes(node.id) && (
              <div title="in Karte sichtbar">
                <PopMapIcon />
              </div>
            )}
          {node.menuType === 'pop' &&
            activeApfloraLayers.includes('pop') &&
            mapIdsFiltered.includes(node.id) && (
              <div title="in Karte hervorgehoben">
                <PopFilteredMapIcon />
              </div>
            )}
          {node.menuType === 'tpop' &&
            activeApfloraLayers.includes('tpop') &&
            !mapIdsFiltered.includes(node.id) && (
              <div title="in Karte sichtbar">
                <TpopMapIcon />
              </div>
            )}
          {node.menuType === 'tpop' &&
            activeApfloraLayers.includes('tpop') &&
            mapIdsFiltered.includes(node.id) && (
              <div title="in Karte hervorgehoben">
                <TpopFilteredMapIcon />
              </div>
            )}
          {node.menuType === 'beobNichtBeurteilt' &&
            activeApfloraLayers.includes('beobNichtBeurteilt') &&
            !mapIdsFiltered.includes(node.id) && (
              <div title="in Karte sichtbar">
                <BeobNichtBeurteiltMapIcon />
              </div>
            )}
          {node.menuType === 'beobNichtBeurteilt' &&
            activeApfloraLayers.includes('beobNichtBeurteilt') &&
            mapIdsFiltered.includes(node.id) && (
              <div title="in Karte hervorgehoben">
                <BeobNichtBeurteiltFilteredMapIcon />
              </div>
            )}
          {node.menuType === 'beobNichtZuzuordnen' &&
            activeApfloraLayers.includes('beobNichtZuzuordnen') &&
            !mapIdsFiltered.includes(node.id) && (
              <div title="in Karte sichtbar">
                <BeobNichtZuzuordnenMapIcon />
              </div>
            )}
          {node.menuType === 'beobNichtZuzuordnen' &&
            activeApfloraLayers.includes('beobNichtZuzuordnen') &&
            mapIdsFiltered.includes(node.id) && (
              <div title="in Karte hervorgehoben">
                <BeobNichtZuzuordnenFilteredMapIcon />
              </div>
            )}
          {activeApfloraLayers.includes('beobZugeordnet') &&
            node.menuType === 'beobZugeordnet' &&
            !mapIdsFiltered.includes(node.id) && (
              <div title="in Karte sichtbar">
                <BeobZugeordnetMapIcon />
              </div>
            )}
          {activeApfloraLayers.includes('beobZugeordnet') &&
            node.menuType === 'beobZugeordnet' &&
            mapIdsFiltered.includes(node.id) && (
              <div title="in Karte hervorgehoben">
                <BeobZugeordnetFilteredMapIcon />
              </div>
            )}
          <TextSpan
            data-nodeisinactivenodepath={nodeIsInActiveNodePath}
            node={node}
            onClick={onClickNode}
          >
            {node.label}
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
    </div>
  )
}

export default observer(Row)
