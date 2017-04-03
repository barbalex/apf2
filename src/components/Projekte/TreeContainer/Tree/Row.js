// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import shouldUpdate from 'recompose/shouldUpdate'
import { ContextMenuTrigger } from 'react-contextmenu'
import FontIcon from 'material-ui/FontIcon'

import isNodeInActiveNodePath from '../../../../modules/isNodeInActiveNodePath'

const singleRowHeight = 23
const StyledNode = styled(({ level, nodeIsInActiveNodePath, children, ...rest }) => <div {...rest}>{children}</div>)`
  padding-left: ${(props) => `${(Number(props.level) * 17) - (props.nodeIsInActiveNodePath ? 4 : 0)}px`};
  height: ${singleRowHeight}px;
  max-height: ${singleRowHeight}px;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  user-select: none;
  color: ${(props) => (props.nodeIsInActiveNodePath ? `rgb(255, 90, 0)` : `rgb(247, 247, 247)`)};
  cursor: pointer;
  &:hover {
    color: orange;
  }
`
const StyledSymbolSpan = styled.span`
  font-family: 'Roboto Mono', monospace;
  margin-right: 0 !important;
  margin-top: -1px !important;
  font-weight: 900 !important;
  font-size: 16px !important;
`
const StyledSymbolOpenSpan = styled(StyledSymbolSpan)`
  margin-top: 2px !important;
  font-size: 22px !important;
`
const StyledTextSpan = styled.span`
  padding-left: .5em;
  font-size: 16px !important;
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
const showPopMapIcon = (store, tree, node) => (
  node.menuType === `ap` &&
  node.id === (tree.activeNodes.ap || store.map.pop.apArtId) &&
  store.map.activeApfloraLayers.includes(`Pop`)
)
const showPopFilteredMapIcon = (store, node) => (
  node.menuType === `pop` &&
  store.map.activeApfloraLayers.includes(`Pop`) &&
  store.map.pop.highlightedIds.includes(node.id)
)
const showTpopMapIcon = (store, tree, node) => (
  node.menuType === `ap` &&
  node.id === (tree.activeNodes.ap || store.map.pop.apArtId) &&
  store.map.activeApfloraLayers.includes(`Tpop`)
)
const showTpopFilteredMapIcon = (store, node) => (
  node.menuType === `tpop` &&
  store.map.activeApfloraLayers.includes(`Tpop`) &&
  store.map.tpop.highlightedIds.includes(node.id)
)
const showBeobNichtBeurteiltMapIcon = (store, tree, node) => (
  node.menuType === `beobzuordnungFolder` &&
  node.id === tree.activeNodes.ap &&
  store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`)
)
const showBeobNichtZuzuordnenMapIcon = (store, tree, node) => (
  node.menuType === `beobNichtZuzuordnenFolder` &&
  node.id === tree.activeNodes.ap &&
  store.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`)
)
const showTpopBeobMapIcon = (store, tree, node) => (
  node.menuType === `tpopbeobFolder` &&
  node.id === tree.activeNodes.tpop &&
  store.map.activeApfloraLayers.includes(`TpopBeob`)
)
const showBeobNichtBeurteiltFilteredMapIcon = (store, node) => (
  node.menuType === `beobzuordnung` &&
  store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`) &&
  store.map.beobNichtBeurteilt.highlightedIds.includes(node.id)
)
const showBeobNichtZuzuordnenFilteredMapIcon = (store, node) => (
  node.menuType === `beobNichtZuzuordnen` &&
  store.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`) &&
  store.map.beobNichtZuzuordnen.highlightedIds.includes(node.id)
)
const showTpopBeobFilteredMapIcon = (store, tree, node) => (
  (
    node.menuType === `tpopbeob` &&
    store.map.activeApfloraLayers.includes(`TpopBeob`) &&
    store.map.tpopBeob.highlightedIds.includes(node.id)
  ) ||
  (
    node.menuType === `tpop` &&
    !tree.activeNodes.tpopbeob &&
    store.map.activeApfloraLayers.includes(`TpopBeob`) &&
    node.id === tree.activeNodes.tpop
  ) ||
  (
    node.menuType === `pop` &&
    !tree.activeNodes.tpop &&
    store.map.activeApfloraLayers.includes(`TpopBeob`) &&
    node.id === tree.activeNodes.pop
  )
)

/**
 * checking props change according to
 * https://marmelab.com/blog/2017/02/06/react-is-slow-react-is-fast.html
 */
const checkPropsChange = (props, nextProps) => {
  return (
    nextProps.node !== props.node ||
    nextProps.store.tree.activeNodeArray.join() !== props.store.tree.activeNodeArray.join() ||
    nextProps.tree !== props.tree ||
    showPopMapIcon(nextProps.store, nextProps.tree, nextProps.node) !== showPopMapIcon(props.store, props.tree, props.node) ||
    showPopFilteredMapIcon(nextProps.store, nextProps.node) !== showPopFilteredMapIcon(props.store, props.node) ||
    showTpopMapIcon(nextProps.store, nextProps.tree, nextProps.node) !== showTpopMapIcon(props.store, props.tree, props.node) ||
    showTpopFilteredMapIcon(nextProps.store, nextProps.node) !== showTpopFilteredMapIcon(props.store, props.node) ||
    showBeobNichtBeurteiltMapIcon(nextProps.store, nextProps.tree, nextProps.node) !== showBeobNichtBeurteiltMapIcon(props.store, props.tree, props.node) ||
    showBeobNichtZuzuordnenMapIcon(nextProps.store, nextProps.tree, nextProps.node) !== showBeobNichtZuzuordnenMapIcon(props.store, props.tree, props.node) ||
    showTpopBeobMapIcon(nextProps.store, nextProps.tree, nextProps.node) !== showTpopBeobMapIcon(props.store, props.tree, props.node) ||
    showBeobNichtBeurteiltFilteredMapIcon(nextProps.store, nextProps.node) !== showBeobNichtBeurteiltFilteredMapIcon(props.store, props.node) ||
    showBeobNichtZuzuordnenFilteredMapIcon(nextProps.store, nextProps.node) !== showBeobNichtZuzuordnenFilteredMapIcon(props.store, props.node) ||
    showTpopBeobFilteredMapIcon(nextProps.store, nextProps.tree, nextProps.node) !== showTpopBeobFilteredMapIcon(props.store, props.tree, props.node)
  )
}

const enhance = compose(
  inject(`store`),
  shouldUpdate(checkPropsChange),
  observer
)

const Row = ({
  key,
  index,
  style,
  store,
  tree,
  node,
}) => {
  const onClick = (event) => {
    store.ui.lastClickY = event.pageY
    tree.toggleNode(node)
  }
  const myProps = { key: index }
  const nodeHasChildren = node.hasChildren
  const symbolTypes = {
    open: `${String.fromCharCode(709)}`,
    closed: `>`,
    hasNoChildren: `-`,
    loadingData: ``,
  }
  let symbol
  const nodeIsInActiveNodePath = isNodeInActiveNodePath(node, tree.activeNodeArray)
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
  const dataUrl = JSON.stringify(node.url)
  const level = node.url.length - 1

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
          level={level}
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
            showPopMapIcon(store, tree, node) &&
            <PopMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </PopMapIcon>
          }
          {
            showTpopMapIcon(store, tree, node) &&
            <TpopMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </TpopMapIcon>
          }
          {
            showBeobNichtBeurteiltMapIcon(store, tree, node) &&
            <BeobNichtBeurteiltMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </BeobNichtBeurteiltMapIcon>
          }
          {
            showBeobNichtZuzuordnenMapIcon(store, tree, node) &&
            <BeobNichtZuzuordnenMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </BeobNichtZuzuordnenMapIcon>
          }
          {
            showTpopBeobMapIcon(store, tree, node) &&
            <TpopBeobMapIcon
              id="map"
              className="material-icons"
              title="in Karte sichtbar"
            >
              local_florist
            </TpopBeobMapIcon>
          }
          {
            showPopFilteredMapIcon(store, node) &&
            <PopFilteredMapIcon
              id="map"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </PopFilteredMapIcon>
          }
          {
            showTpopFilteredMapIcon(store, node) &&
            <TpopFilteredMapIcon
              id="map"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </TpopFilteredMapIcon>
          }
          {
            showBeobNichtBeurteiltFilteredMapIcon(store, node) &&
            <BeobNichtBeurteiltFilteredMapIcon
              id="BeobNichtBeurteiltFilteredMapIcon"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </BeobNichtBeurteiltFilteredMapIcon>
          }
          {
            showBeobNichtZuzuordnenFilteredMapIcon(store, node) &&
            <BeobNichtZuzuordnenFilteredMapIcon
              id="BeobNichtZuzuordnenFilteredMapIcon"
              className="material-icons"
              title="in Karte hervorgehoben"
            >
              local_florist
            </BeobNichtZuzuordnenFilteredMapIcon>
          }
          {
            showTpopBeobFilteredMapIcon(store, tree, node) &&
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
  node: PropTypes.object.isRequired,
}

export default enhance(Row)
