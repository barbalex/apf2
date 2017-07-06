// @flow
import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { ContextMenuTrigger } from 'react-contextmenu'
import FontIcon from 'material-ui/FontIcon'

import isNodeInActiveNodePath from '../../../../modules/isNodeInActiveNodePath'
import isNodeOpen from '../../../../modules/isNodeOpen'

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
    props['data-nodeIsInActiveNodePath'] ? '#D84315' : 'inherit'};
`
const SymbolIcon = styled(FontIcon)`
  margin-top: ${props =>
    props['data-nodeIsInActiveNodePath']
      ? '-5px !important'
      : '-2px !important'};
  padding-left: ${props =>
    props['data-nodeIsInActiveNodePath'] ? '2px' : '2px'};
  font-size: ${props =>
    props['data-nodeIsInActiveNodePath']
      ? '26px !important'
      : '22px !important'};
  font-weight: ${props =>
    props['data-nodeIsInActiveNodePath'] ? '900 !important' : 'inherit'};
  color: ${props =>
    props['data-nodeIsInActiveNodePath'] ? '#D84315 !important' : 'inherit'};
  width: 26px;
  cursor: pointer;
  &:hover {
    color: #F57C00 !important;
  }
`
const SymbolSpan = styled.span`
  padding-right: 8px !important;
  padding-left: ${props =>
    props['data-nodeIsInActiveNodePath'] ? '7px' : '9px'};
  font-weight: ${props =>
    props['data-nodeIsInActiveNodePath'] ? '900 !important' : 'inherit'};
  margin-top: -9px !important;
  font-size: 28px !important;
  width: 26px;
`
const TextSpan = styled.span`
  margin-left: 0;
  font-size: 16px !important;
  font-weight: ${props =>
    props['data-nodeIsInActiveNodePath'] ? '900 !important' : 'inherit'};
  cursor: pointer;
  &:hover {
    color: #f57c00;
  }
`
const StyledMapIcon = styled(FontIcon)`
  padding-right: 2px;
  margin-left: -2px;
  font-size: 20px !important;
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
const TpopBeobMapIcon = styled(StyledMapIcon)`
  color: #FF00FF !important;
`
const PopFilteredMapIcon = styled(PopMapIcon)`
  -webkit-text-stroke: 1px #f5ef00;
  -moz-text-stroke: 1px #f5ef00;
`
const TpopFilteredMapIcon = styled(TpopMapIcon)`
  -webkit-text-stroke: 1px #f5ef00;
  -moz-text-stroke: 1px #f5ef00;
`
const BeobNichtBeurteiltFilteredMapIcon = styled(BeobNichtBeurteiltMapIcon)`
  -webkit-text-stroke: 1px #f5ef00;
  -moz-text-stroke: 1px #f5ef00;
`
const BeobNichtZuzuordnenFilteredMapIcon = styled(BeobNichtZuzuordnenMapIcon)`
  -webkit-text-stroke: 1px #f5ef00;
  -moz-text-stroke: 1px #f5ef00;
`
const TpopBeobFilteredMapIcon = styled(TpopBeobMapIcon)`
  -webkit-text-stroke: 1px #f5ef00;
  -moz-text-stroke: 1px #f5ef00;
`
const MovingIcon = styled(FontIcon)`
  padding-left: .2em;
  font-size: 20px !important;
  color: rgb(255, 90, 0) !important;
`
const CopyingIcon = styled(MovingIcon)``
const showPopMapIcon = (store, tree, node) =>
  node.menuType === 'ap' &&
  node.id === (tree.activeNodes.ap || store.map.pop.apArtId) &&
  store.map.activeApfloraLayers.includes('Pop')
const showPopFilteredMapIcon = (store, node) =>
  node.menuType === 'pop' &&
  store.map.activeApfloraLayers.includes('Pop') &&
  store.map.pop.highlightedIds.includes(node.id)
const showTpopMapIcon = (store, tree, node) =>
  node.menuType === 'ap' &&
  node.id === (tree.activeNodes.ap || store.map.pop.apArtId) &&
  store.map.activeApfloraLayers.includes('Tpop')
const showTpopFilteredMapIcon = (store, node) =>
  node.menuType === 'tpop' &&
  store.map.activeApfloraLayers.includes('Tpop') &&
  store.map.tpop.highlightedIds.includes(node.id)
const showBeobNichtBeurteiltMapIcon = (store, tree, node) =>
  node.menuType === 'beobzuordnungFolder' &&
  node.id === tree.activeNodes.ap &&
  store.map.activeApfloraLayers.includes('BeobNichtBeurteilt')
const showBeobNichtZuzuordnenMapIcon = (store, tree, node) =>
  node.menuType === 'beobNichtZuzuordnenFolder' &&
  node.id === tree.activeNodes.ap &&
  store.map.activeApfloraLayers.includes('BeobNichtZuzuordnen')
const showTpopBeobMapIcon = (store, tree, node) =>
  node.menuType === 'tpopbeobFolder' &&
  node.id === tree.activeNodes.tpop &&
  store.map.activeApfloraLayers.includes('TpopBeob')
const showBeobNichtBeurteiltFilteredMapIcon = (store, node) =>
  node.menuType === 'beobzuordnung' &&
  store.map.activeApfloraLayers.includes('BeobNichtBeurteilt') &&
  store.map.beobNichtBeurteilt.highlightedIds.includes(node.id)
const showBeobNichtZuzuordnenFilteredMapIcon = (store, node) =>
  node.menuType === 'beobNichtZuzuordnen' &&
  store.map.activeApfloraLayers.includes('BeobNichtZuzuordnen') &&
  store.map.beobNichtZuzuordnen.highlightedIds.includes(node.id)
const showTpopBeobFilteredMapIcon = (store, tree, node) =>
  (node.menuType === 'tpopbeob' &&
    store.map.activeApfloraLayers.includes('TpopBeob') &&
    store.map.tpopBeob.highlightedIds.includes(node.id)) ||
  (node.menuType === 'tpop' &&
    !tree.activeNodes.tpopbeob &&
    store.map.activeApfloraLayers.includes('TpopBeob') &&
    node.id === tree.activeNodes.tpop) ||
  (node.menuType === 'pop' &&
    !tree.activeNodes.tpop &&
    store.map.activeApfloraLayers.includes('TpopBeob') &&
    node.id === tree.activeNodes.pop)

const enhance = compose(inject('store'), observer)

const Row = ({
  key,
  index,
  style,
  store,
  tree,
}: {
  key?: number,
  index: number,
  style: Object,
  store: Object,
  tree: Object,
}) => {
  const node = tree.nodes[index]
  const onClickNode = event => tree.toggleNode(tree, node)
  const onClickNodeSymbol = event => tree.toggleNodeSymbol(tree, node)
  const myProps = { key: index }
  const nodeIsInActiveNodePath = isNodeInActiveNodePath(
    node,
    toJS(tree.activeNodeArray)
  )
  // build symbols
  let useSymbolIcon = true
  let useSymbolSpan = false
  let symbolIcon
  if (node.hasChildren && isNodeOpen(toJS(tree.openNodes), node.url)) {
    symbolIcon = 'expand_more'
  } else if (node.hasChildren) {
    symbolIcon = 'chevron_right'
  } else if (node.label === 'lade Daten...') {
    symbolIcon = 'more_horiz'
  } else {
    useSymbolSpan = true
    useSymbolIcon = false
  }
  const dataUrl = JSON.stringify(node.url)
  const level = node.url.length - 1
  const moving =
    node.nodeType === 'table' &&
    node.menuType === store.moving.table &&
    node.id === store.moving.id
  const copying =
    node.nodeType === 'table' &&
    node.menuType === store.copying.table &&
    node.id === store.copying.id
  const copyingBiotop =
    node.nodeType === 'table' && node.id === store.copyingBiotop.id

  return (
    <div key={key} style={style}>
      <ContextMenuTrigger
        id={`${tree.name}${node.menuType}`}
        collect={props => myProps}
        nodeId={node.id}
        nodeLabel={node.label}
        key={`${node.menuType}${node.id}`}
      >
        <StyledNode
          data-level={level}
          data-nodeIsInActiveNodePath={nodeIsInActiveNodePath}
          data-id={node.id}
          data-parentId={node.parentId}
          data-url={dataUrl}
          data-nodeType={node.nodeType}
          data-label={node.label}
          data-menuType={node.menuType}
        >
          {useSymbolIcon &&
            <SymbolIcon
              data-nodeIsInActiveNodePath={nodeIsInActiveNodePath}
              id="symbol"
              className="material-icons"
              onClick={onClickNodeSymbol}
            >
              {symbolIcon}
            </SymbolIcon>}
          {useSymbolSpan &&
            <SymbolSpan data-nodeIsInActiveNodePath={nodeIsInActiveNodePath}>
              {'-'}
            </SymbolSpan>}
          {showPopMapIcon(store, tree, node) &&
            <PopMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </PopMapIcon>}
          {showTpopMapIcon(store, tree, node) &&
            <TpopMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </TpopMapIcon>}
          {showBeobNichtBeurteiltMapIcon(store, tree, node) &&
            <BeobNichtBeurteiltMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </BeobNichtBeurteiltMapIcon>}
          {showBeobNichtZuzuordnenMapIcon(store, tree, node) &&
            <BeobNichtZuzuordnenMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </BeobNichtZuzuordnenMapIcon>}
          {showTpopBeobMapIcon(store, tree, node) &&
            <TpopBeobMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </TpopBeobMapIcon>}
          {showPopFilteredMapIcon(store, node) &&
            <PopFilteredMapIcon
              id="map"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </PopFilteredMapIcon>}
          {showTpopFilteredMapIcon(store, node) &&
            <TpopFilteredMapIcon
              id="map"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </TpopFilteredMapIcon>}
          {showBeobNichtBeurteiltFilteredMapIcon(store, node) &&
            <BeobNichtBeurteiltFilteredMapIcon
              id="BeobNichtBeurteiltFilteredMapIcon"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </BeobNichtBeurteiltFilteredMapIcon>}
          {showBeobNichtZuzuordnenFilteredMapIcon(store, node) &&
            <BeobNichtZuzuordnenFilteredMapIcon
              id="BeobNichtZuzuordnenFilteredMapIcon"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </BeobNichtZuzuordnenFilteredMapIcon>}
          {showTpopBeobFilteredMapIcon(store, tree, node) &&
            <TpopBeobFilteredMapIcon
              id="TpopBeobFilteredMapIcon"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </TpopBeobFilteredMapIcon>}
          <TextSpan
            data-nodeIsInActiveNodePath={nodeIsInActiveNodePath}
            node={node}
            onClick={onClickNode}
          >
            {node.label}
          </TextSpan>
          {moving &&
            <MovingIcon
              id="moving"
              className="material-icons"
              title="zum Verschieben gemerkt, bereit zum Einfügen"
            >
              swap_vertical_circle
            </MovingIcon>}
          {copying &&
            <CopyingIcon
              id="copying"
              className="material-icons"
              title="kopiert, bereit zum Einfügen"
            >
              content_copy
            </CopyingIcon>}
          {copyingBiotop &&
            <CopyingIcon
              id="copyingBiotop"
              className="material-icons"
              title="Biotop kopiert, bereit zum Einfügen"
            >
              photo_library
            </CopyingIcon>}
        </StyledNode>
      </ContextMenuTrigger>
    </div>
  )
}

export default enhance(Row)
