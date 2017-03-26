// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { ContextMenuTrigger } from 'react-contextmenu'
import FontIcon from 'material-ui/FontIcon'

import isNodeInActiveNodePath from '../../../../modules/isNodeInActiveNodePath'

const singleRowHeight = 23
const StyledNode = styled(({ level, nodeIsInActiveNodePath, children, ...rest }) => <div {...rest}>{children}</div>)`
  padding-left: ${(props) => `${Number(props.level) * 16}px`};
  height: ${singleRowHeight}px;
  max-height: ${singleRowHeight}px;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  user-select: none;
  color: ${(props) => (props.nodeIsInActiveNodePath ? `rgb(255, 94, 94)` : `rgb(247, 247, 247)`)};
  cursor: pointer;
  &:hover {
    color: orange;
  }
`
const StyledSymbolSpan = styled.span`
  margin-right: 0 !important;
  font-weight: 900 !important;
`
const StyledSymbolOpenSpan = styled(StyledSymbolSpan)`
  /*margin-top: -0.2em; only necessary on mac!!!*/
  font-size: 1.4em !important;
`
const StyledTextSpan = styled.span`
  padding-left: .5em;
`
const StyledTextInActiveNodePathSpan = styled(StyledTextSpan)`
  font-weight: 900 !important;
`
const StyledMapIcon = styled(FontIcon)`
  padding-left: .2em;
  margin-right: -0.1em;
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

const enhance = compose(
  inject(`store`),
  observer
)

const Row = ({ key, index, style, store, nodes, url, activeUrlElementsAp, popApArtId }) => {
  const node = nodes[index]
  const onClick = (event) => {
    store.ui.lastClickY = event.pageY
    store.node.toggleNode(node)
  }
  const myProps = { key: index }
  const nodeHasChildren = node.childrenLength > 0
  const symbolTypes = {
    open: `${String.fromCharCode(709)}`,
    closed: `>`,
    hasNoChildren: `-`,
    loadingData: ``,
  }
  let symbol
  const nodeIsInActiveNodePath = isNodeInActiveNodePath(node, url)
  let SymbolSpan = StyledSymbolSpan
  const TextSpan = nodeIsInActiveNodePath ? StyledTextInActiveNodePathSpan : StyledTextSpan

  if (nodeHasChildren && node.expanded) {
    symbol = symbolTypes.open
    if (nodeIsInActiveNodePath) {
      SymbolSpan = StyledSymbolOpenSpan
    }
  } else if (nodeHasChildren) {
    symbol = symbolTypes.closed
  } else if (node.label === `lade Daten...`) {
    symbol = symbolTypes.loadingData
  } else {
    symbol = symbolTypes.hasNoChildren
  }
  const showPopMapIcon = (
    node.menuType === `ap` &&
    node.id === (activeUrlElementsAp || popApArtId) &&
    store.map.activeApfloraLayers.includes(`Pop`)
  )
  const showPopFilteredMapIcon = (
    node.menuType === `pop` &&
    store.map.activeApfloraLayers.includes(`Pop`) &&
    store.map.pop.highlightedIds.includes(node.id)
  )
  const showTpopMapIcon = (
    node.menuType === `ap` &&
    node.id === (activeUrlElementsAp || store.map.pop.apArtId) &&
    store.map.activeApfloraLayers.includes(`Tpop`)
  )
  const showTpopFilteredMapIcon = (
    node.menuType === `tpop` &&
    store.map.activeApfloraLayers.includes(`Tpop`) &&
    store.map.tpop.highlightedIds.includes(node.id)
  )
  const showBeobNichtBeurteiltMapIcon = (
    node.menuType === `beobzuordnungFolder` &&
    node.id === activeUrlElementsAp &&
    store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`)
  )
  const showBeobNichtZuzuordnenMapIcon = (
    node.menuType === `beobNichtZuzuordnenFolder` &&
    node.id === activeUrlElementsAp &&
    store.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`)
  )
  const showTpopBeobMapIcon = (
    node.menuType === `tpopbeobFolder` &&
    node.id === store.activeUrlElements.tpop &&
    store.map.activeApfloraLayers.includes(`TpopBeob`)
  )
  const showBeobNichtBeurteiltFilteredMapIcon = (
    node.menuType === `beobzuordnung` &&
    store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`) &&
    store.map.beobNichtBeurteilt.highlightedIds.includes(node.id)
  )
  const showBeobNichtZuzuordnenFilteredMapIcon = (
    node.menuType === `beobNichtZuzuordnen` &&
    store.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`) &&
    store.map.beobNichtZuzuordnen.highlightedIds.includes(node.id)
  )
  const showTpopBeobFilteredMapIcon = (
    (
      node.menuType === `tpopbeob` &&
      store.map.activeApfloraLayers.includes(`TpopBeob`) &&
      store.map.tpopBeob.highlightedIds.includes(node.id)
    ) ||
    (
      node.menuType === `tpop` &&
      !store.activeUrlElements.tpopbeob &&
      store.map.activeApfloraLayers.includes(`TpopBeob`) &&
      node.id === store.activeUrlElements.tpop
    ) ||
    (
      node.menuType === `pop` &&
      !store.activeUrlElements.tpop &&
      store.map.activeApfloraLayers.includes(`TpopBeob`) &&
      node.id === store.activeUrlElements.pop
    )
  )
  const dataUrl = JSON.stringify(node.url)

  return (
    <div key={key} style={style} onClick={onClick}>
      <ContextMenuTrigger
        id={node.menuType}
        collect={props => myProps}
        nodeId={node.id}
        nodeLabel={node.label}
        key={`${node.menuType}${node.id}`}
      >
        <StyledNode
          level={node.level}
          nodeIsInActiveNodePath={nodeIsInActiveNodePath}
          data-id={node.id}
          data-parentId={node.parentId}
          data-url={dataUrl}
          data-nodeType={node.nodeType}
          data-label={node.label}
          data-menuType={node.menuType}
        >
          <SymbolSpan>
            {symbol}
          </SymbolSpan>
          {
            showPopMapIcon &&
            <PopMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </PopMapIcon>
          }
          {
            showTpopMapIcon &&
            <TpopMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </TpopMapIcon>
          }
          {
            showBeobNichtBeurteiltMapIcon &&
            <BeobNichtBeurteiltMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </BeobNichtBeurteiltMapIcon>
          }
          {
            showBeobNichtZuzuordnenMapIcon &&
            <BeobNichtZuzuordnenMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </BeobNichtZuzuordnenMapIcon>
          }
          {
            showTpopBeobMapIcon &&
            <TpopBeobMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </TpopBeobMapIcon>
          }
          {
            showPopFilteredMapIcon &&
            <PopFilteredMapIcon
              id="map"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </PopFilteredMapIcon>
          }
          {
            showTpopFilteredMapIcon &&
            <TpopFilteredMapIcon
              id="map"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </TpopFilteredMapIcon>
          }
          {
            showBeobNichtBeurteiltFilteredMapIcon &&
            <BeobNichtBeurteiltFilteredMapIcon
              id="BeobNichtBeurteiltFilteredMapIcon"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </BeobNichtBeurteiltFilteredMapIcon>
          }
          {
            showBeobNichtZuzuordnenFilteredMapIcon &&
            <BeobNichtZuzuordnenFilteredMapIcon
              id="BeobNichtZuzuordnenFilteredMapIcon"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </BeobNichtZuzuordnenFilteredMapIcon>
          }
          {
            showTpopBeobFilteredMapIcon &&
            <TpopBeobFilteredMapIcon
              id="TpopBeobFilteredMapIcon"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </TpopBeobFilteredMapIcon>
          }
          <TextSpan>
            {node.label}
          </TextSpan>
        </StyledNode>
      </ContextMenuTrigger>
    </div>
  )
}

Row.propTypes = {
  store: PropTypes.object.isRequired,
  key: PropTypes.number,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  url: PropTypes.array.isRequired,
  activeUrlElementsAp: PropTypes.number,
  popApArtId: PropTypes.number,
}

export default enhance(Row)
