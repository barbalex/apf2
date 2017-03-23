// @flow
/*
 * Strukturbaum
 * need class because of ref and componentDidUpdate
 */

import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import { AutoSizer, List } from 'react-virtualized'
import { ContextMenuTrigger } from 'react-contextmenu'
import styled from 'styled-components'
import compose from 'recompose/compose'
import FontIcon from 'material-ui/FontIcon'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'

import isNodeInActiveNodePath from '../../../modules/isNodeInActiveNodePath'

const singleRowHeight = 23
const Container = styled.div`
  height: 100%;
  font-family: 'Roboto Mono', monospace;
  ul {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1.1em;
  }
  /* need this because react-virtualized scrolls to far down, see
   * https://github.com/bvaughn/react-virtualized/issues/543
   */
  .ReactVirtualized__Grid {
    overflow-x: hidden !important;
  }
`
const ListContainer = styled(List)`
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: normal;
  * {
    box-sizing: border-box;
    font-size: 14px;
    font-weight: normal;
  }
  &:focus {
    outline-color: rgb(48, 48, 48) !important;
  }
`
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
  font-weight: ${(props) => (props.nodeIsInActiveNodePath ? `14px` : `1.1em`)};
  font-size: ${(props) => (props.nodeIsInActiveNodePath ? `rgb(255, 94, 94)` : `rgb(247, 247, 247)`)};
  font-size: 1.1em;
  cursor: pointer;
  color: ${(props) => (props.nodeIsInActiveNodePath ? `rgb(255, 94, 94)` : `rgb(247, 247, 247)`)};
  &:hover {
    color: orange;
  }
`
const StyledSymbolSpan = styled.span`
  margin-right: 0;
  font-weight: 900;
`
const StyledSymbolOpenSpan = styled(StyledSymbolSpan)`
  /*margin-top: -0.2em; only necessary on mac!!!*/
  font-size: 1.4em;
`
const StyledTextSpan = styled.span`
  padding-left: .5em;
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
const StyledTextInActiveNodePathSpan = styled(StyledTextSpan)`
  font-weight: 900;
`
const LoadingDiv = styled.div`
  padding-left: 15px;
  font-size: 14px;
`
const enhance = compose(
  inject(`store`),
  observer
)

class Strukturbaum extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    mapTpopBeobVisible: PropTypes.bool.isRequired,
    mapBeobNichtBeurteiltVisible: PropTypes.bool.isRequired,
    mapBeobNichtZuzuordnenVisible: PropTypes.bool.isRequired,
    mapPopVisible: PropTypes.bool.isRequired,
    mapTpopVisible: PropTypes.bool.isRequired,
  }

  componentDidUpdate(prevProps) {
    const {
      mapTpopBeobVisible,
      mapBeobNichtBeurteiltVisible,
      mapBeobNichtZuzuordnenVisible,
      mapPopVisible,
      mapTpopVisible,
    } = this.props
    const {
      mapTpopBeobVisible: prevMapTpopBeobVisible,
      mapBeobNichtBeurteiltVisible: prevMapBeobNichtBeurteiltVisible,
      mapBeobNichtZuzuordnenVisible: prevMapBeobNichtZuzuordnenVisible,
      mapPopVisible: prevMapPopVisible,
      mapTpopVisible: prevMapTpopVisible,
    } = prevProps
    const somethingHasChanged = (
      mapTpopBeobVisible !== prevMapTpopBeobVisible ||
      mapBeobNichtBeurteiltVisible !== prevMapBeobNichtBeurteiltVisible ||
      mapBeobNichtZuzuordnenVisible !== prevMapBeobNichtZuzuordnenVisible ||
      mapPopVisible !== prevMapPopVisible ||
      mapTpopVisible !== prevMapTpopVisible
    )
    if (somethingHasChanged) {
      this.tree.forceUpdateGrid()
    }
  }

  rowRenderer = ({ key, index, style }) => {
    const { store } = this.props
    const node = store.node.node.nodes[index]
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
    const nodeIsInActiveNodePath = isNodeInActiveNodePath(node, store.url)
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
      node.id === (store.activeUrlElements.ap || store.map.pop.apArtId) &&
      store.map.activeApfloraLayers.includes(`Pop`)
    )
    const showPopFilteredMapIcon = (
      node.menuType === `pop` &&
      store.map.activeApfloraLayers.includes(`Pop`) &&
      store.map.pop.highlightedIds.includes(node.id)
    )
    const showTpopMapIcon = (
      node.menuType === `ap` &&
      node.id === (store.activeUrlElements.ap || store.map.pop.apArtId) &&
      store.map.activeApfloraLayers.includes(`Tpop`)
    )
    const showTpopFilteredMapIcon = (
      node.menuType === `tpop` &&
      store.map.activeApfloraLayers.includes(`Tpop`) &&
      store.map.tpop.highlightedIds.includes(node.id)
    )
    const showBeobNichtBeurteiltMapIcon = (
      node.menuType === `beobzuordnungFolder` &&
      node.id === store.activeUrlElements.ap &&
      store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`)
    )
    const showBeobNichtZuzuordnenMapIcon = (
      node.menuType === `beobNichtZuzuordnenFolder` &&
      node.id === store.activeUrlElements.ap &&
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

    return (
      <div key={key} style={style} onClick={onClick}>
        <ContextMenuTrigger
          id={node.menuType}
          collect={props => myProps}
          nodeId={node.id}
          nodeLabel={node.label}
          key={`${index}-child`}
        >
          <StyledNode
            level={node.level}
            nodeIsInActiveNodePath={nodeIsInActiveNodePath}
            data-id={node.id}
            data-parentId={node.parentId}
            data-url={JSON.stringify(node.url)}
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

  noRowsRenderer = () => {
    const { store } = this.props
    const message = (
      store.table.projektLoading ?
      `lade Daten...` :
      `keine Daten`
    )
    return (
      <Container>
        <LoadingDiv>
          {message}
        </LoadingDiv>
      </Container>
    )
  }

  render() {  // eslint-disable-line class-methods-use-this
    const { store } = this.props

    // calculate scrolltop
    // without this if a folder low in the tree is opened,
    // it always gets scrolled down out of sight
    const nodes = store.node.node.nodes
    const activeNodeIndex = findIndex(nodes, node =>
      isEqual(node.url, store.url)
    )

    return (
      <Container>
        <AutoSizer>
          {({ height, width }) =>
            <ListContainer
              height={height}
              rowCount={nodes.length}
              rowHeight={singleRowHeight}
              rowRenderer={this.rowRenderer}
              noRowsRenderer={this.noRowsRenderer}
              scrollToIndex={activeNodeIndex}
              width={width}
              {...store.node.node.nodes}
              // need to use innerRef because ListContainer is a styled component
              innerRef={(c) => { this.tree = c }}
            />
          }
        </AutoSizer>
      </Container>
    )
  }
}

export default enhance(Strukturbaum)
