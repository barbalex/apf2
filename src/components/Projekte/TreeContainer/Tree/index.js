// @flow
/*
 * Tree
 * need class because of ref and componentDidUpdate
 */

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import styled from 'styled-components'
import compose from 'recompose/compose'
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
const enhance = compose(inject('store'), observer)

class Tree extends Component {
  props: {
    treeName: String,
    data: Object,
    store: Object,
    tree: Object,
    projektLoading: boolean,
    nodes: Array<Object>,
    mapBeobZugeordnetVisible: boolean,
    mapBeobNichtBeurteiltVisible: boolean,
    mapBeobNichtZuzuordnenVisible: boolean,
    mapPopVisible: boolean,
    mapTpopVisible: boolean,
    activeNodeArray: Array<Object>,
  }

  tree: ?HTMLDivElement

  static defaultProps = {
    projektLoading: false,
  }

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

  rowRenderer = ({ key, index, style }) => (
    <Row
      key={key}
      index={index}
      style={style}
      tree={this.props.tree}
      openNodes={this.props.tree.openNodes}
      nodes={this.props.nodes}
      data={this.props.data}
      treeName={this.props.treeName}
    />
  )

  noRowsRenderer = () => (
    <Container>
      <LoadingDiv>
        {this.props.projektLoading ? 'lade Daten...' : 'keine Daten'}
      </LoadingDiv>
    </Container>
  )

  render() {
    const { nodes, activeNodeArray } = this.props

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
              />
            )}
          </AutoSizer>
        </Container>
      </ErrorBoundary>
    )
  }
}

export default enhance(Tree)
