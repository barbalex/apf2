// @flow
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

type Props = {
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
  mapIdsFiltered: Array<String>,
  mapFilter: Object,
}

class Tree extends Component<Props> {

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
      mapIdsFiltered,
    } = this.props
    
    return (
      <Row
        key={key}
        style={style}
        index={index}
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
        mapIdsFiltered={mapIdsFiltered}
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
      mapFilter,
      data,
    } = this.props
    console.log('Tree, nodes:', nodes)

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
                // ...when anything changes in the queried data
                // without this AP label did not update when Art was changed
                dataString={JSON.stringify(data)}
              />
            )}
          </AutoSizer>
        </Container>
      </ErrorBoundary>
    )
  }
}

export default Tree
