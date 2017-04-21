// @flow
/*
 * Tree
 * need class because of ref and componentDidUpdate
 */

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { AutoSizer, List } from 'react-virtualized'
import styled from 'styled-components'
import compose from 'recompose/compose'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'

import Row from './Row'

const singleRowHeight = 23
const Container = styled.div`
  height: 100%;
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
const enhance = compose(inject(`store`), observer)

class Tree extends Component {
  props: {
    store: Object,
    tree: Object,
    projektLoading: boolean,
    nodes: Array<Object>,
    mapTpopBeobVisible: boolean,
    mapBeobNichtBeurteiltVisible: boolean,
    mapBeobNichtZuzuordnenVisible: boolean,
    mapPopVisible: boolean,
    mapTpopVisible: boolean,
    activeNodeArray: Array<Object>,
    lastClickedNode: Object
  }

  static defaultProps = {
    projektLoading: false
  }

  componentDidUpdate(prevProps) {
    const {
      mapTpopBeobVisible,
      mapBeobNichtBeurteiltVisible,
      mapBeobNichtZuzuordnenVisible,
      mapPopVisible,
      mapTpopVisible
    } = this.props
    const {
      mapTpopBeobVisible: prevMapTpopBeobVisible,
      mapBeobNichtBeurteiltVisible: prevMapBeobNichtBeurteiltVisible,
      mapBeobNichtZuzuordnenVisible: prevMapBeobNichtZuzuordnenVisible,
      mapPopVisible: prevMapPopVisible,
      mapTpopVisible: prevMapTpopVisible
    } = prevProps
    const somethingHasChanged =
      mapTpopBeobVisible !== prevMapTpopBeobVisible ||
      mapBeobNichtBeurteiltVisible !== prevMapBeobNichtBeurteiltVisible ||
      mapBeobNichtZuzuordnenVisible !== prevMapBeobNichtZuzuordnenVisible ||
      mapPopVisible !== prevMapPopVisible ||
      mapTpopVisible !== prevMapTpopVisible
    if (somethingHasChanged) {
      // $FlowIssue
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
    />
  )

  noRowsRenderer = () => (
    <Container>
      <LoadingDiv>
        {this.props.projektLoading ? `lade Daten...` : `keine Daten`}
      </LoadingDiv>
    </Container>
  )

  render() {
    // eslint-disable-line class-methods-use-this
    const { nodes, activeNodeArray, lastClickedNode } = this.props
    let lastClickedNodeIndex = findIndex(nodes, node =>
      isEqual(node.url, lastClickedNode)
    )
    // if no index found, use activeNodeArray
    if (lastClickedNodeIndex === -1) {
      lastClickedNodeIndex = findIndex(nodes, node =>
        isEqual(node.url, activeNodeArray)
      )
    }

    return (
      <Container>
        <AutoSizer>
          {({ height, width }) => (
            <ListContainer
              height={height}
              rowCount={nodes.length}
              rowHeight={singleRowHeight}
              rowRenderer={this.rowRenderer}
              noRowsRenderer={this.noRowsRenderer}
              scrollToIndex={lastClickedNodeIndex}
              width={width}
              // need to use innerRef
              // because ListContainer is a styled component
              innerRef={c => {
                // $FlowIssue
                this.tree = c
              }}
            />
          )}
        </AutoSizer>
      </Container>
    )
  }
}

export default enhance(Tree)
