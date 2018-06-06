// @flow
/*
 * Tree
 * need class because of ref and componentDidUpdate
 */

import React, { Component } from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import styled from 'styled-components'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'

import Row from './Row'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const singleRowHeight = 23
const Container = styled.div`
  height: 100%;
  ul {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1.1em;
  }
  /* need this because react-virtualized scrolls too far down, see
   * https://github.com/bvaughn/react-virtualized/issues/543
   */
  .ReactVirtualized__Grid {
    overflow-x: hidden !important;
  }
`
const ListContainer = styled(List)`
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
const LoadingDiv = styled.div`
  padding-left: 15px;
  font-size: 14px;
`

class Tree extends Component {
  props: {
    client: Object,
    treeName: String,
    data: Object,
    tree: Object,
    nodes: Array<Object>,
    loading: Boolean,
    activeNodes: Array<Object>,
    mapBeobZugeordnetVisible: boolean,
    mapBeobNichtBeurteiltVisible: boolean,
    mapBeobNichtZuzuordnenVisible: boolean,
    mapPopVisible: boolean,
    mapTpopVisible: boolean,
    activeNodeArray: Array<Object>,
    moving: Object,
    copying: Object,
    activeApfloraLayers: Array<String>,
    mapPopIdsFiltered: Array<String>,
    mapTpopIdsFiltered: Array<String>,
    mapBeobNichtBeurteiltIdsFiltered: Array<String>,
    mapBeobZugeordnetIdsFiltered: Array<String>,
    mapBeobNichtZuzuordnenIdsFiltered: Array<String>,
    mapFilter: Object,
  }

  tree: ?HTMLDivElement

  componentDidUpdate(prevProps) {
    const {
      mapBeobZugeordnetVisible,
      mapBeobNichtBeurteiltVisible,
      mapBeobNichtZuzuordnenVisible,
      mapPopVisible,
      mapTpopVisible,
    } = this.props
    const {
      mapBeobZugeordnetVisible: prevMapBeobZugeordnetVisible,
      mapBeobNichtBeurteiltVisible: prevMapBeobNichtBeurteiltVisible,
      mapBeobNichtZuzuordnenVisible: prevMapBeobNichtZuzuordnenVisible,
      mapPopVisible: prevMapPopVisible,
      mapTpopVisible: prevMapTpopVisible,
    } = prevProps
    const somethingHasChanged =
      mapBeobZugeordnetVisible !== prevMapBeobZugeordnetVisible ||
      mapBeobNichtBeurteiltVisible !== prevMapBeobNichtBeurteiltVisible ||
      mapBeobNichtZuzuordnenVisible !== prevMapBeobNichtZuzuordnenVisible ||
      mapPopVisible !== prevMapPopVisible ||
      mapTpopVisible !== prevMapTpopVisible
    if (somethingHasChanged) {
      this.tree.forceUpdateGrid()
    }
  }

  rowRenderer = ({ key, index, style }) => {
    const {
      tree,
      nodes,
      data,
      treeName,
      client,
      activeNodes,
      moving,
      copying,
      activeApfloraLayers,
      mapFilter,
      mapPopIdsFiltered,
      mapTpopIdsFiltered,
      mapBeobNichtBeurteiltIdsFiltered,
      mapBeobZugeordnetIdsFiltered,
      mapBeobNichtZuzuordnenIdsFiltered,
    } = this.props
    
    return (
      <Row
        key={key}
        index={index}
        style={style}
        tree={tree}
        openNodes={tree.openNodes}
        activeNodes={activeNodes}
        nodes={nodes}
        data={data}
        treeName={treeName}
        client={client}
        moving={moving}
        copying={copying}
        activeApfloraLayers={activeApfloraLayers}
        mapFilter={mapFilter}
        mapPopIdsFiltered={mapPopIdsFiltered}
        mapTpopIdsFiltered={mapTpopIdsFiltered}
        mapBeobNichtBeurteiltIdsFiltered={mapBeobNichtBeurteiltIdsFiltered}
        mapBeobNichtZuzuordnenIdsFiltered={mapBeobNichtZuzuordnenIdsFiltered}
        mapBeobZugeordnetIdsFiltered={mapBeobZugeordnetIdsFiltered}
      />
    )
}

  noRowsRenderer = () => (
    <Container>
      <LoadingDiv>
        lade Daten...
      </LoadingDiv>
    </Container>
  )

  render() {
    const {
      nodes,
      activeNodeArray,
      activeApfloraLayers,
      loading,
      copying,
      moving,
      mapFilter
    } = this.props

    return (
      <ErrorBoundary>
        <Container>
          <AutoSizer>
            {({ height, width }) => (
              <ListContainer
                height={height}
                rowCount={nodes.length}
                rowHeight={singleRowHeight}
                rowRenderer={this.rowRenderer}
                noRowsRenderer={this.noRowsRenderer}
                scrollToIndex={findIndex(nodes, node =>
                  isEqual(node.url, activeNodeArray)
                )}
                width={width}
                innerRef={c => (this.tree = c)}
                // force rerender when:
                // ...second query finisches
                loading={loading}
                // ...after copying and moving
                copying={copying}
                moving={moving}
                // ...map filter changes
                mapFilterString={mapFilter.features.toString()}
                // ...active apflora layers change
                activeApfloraLayersString={activeApfloraLayers.join()}
              />
            )}
          </AutoSizer>
        </Container>
      </ErrorBoundary>
    )
  }
}

export default Tree
