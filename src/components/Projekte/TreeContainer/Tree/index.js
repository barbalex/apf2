// @flow
/*
 * Tree
 * need class because of ref and componentDidUpdate
 */

import React, { Component, PropTypes } from 'react'
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
const enhance = compose(
  inject(`store`),
  observer
)

class Tree extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    tree: PropTypes.object.isRequired,
    projektLoading: PropTypes.bool,
    nodes: PropTypes.array.isRequired,
    mapTpopBeobVisible: PropTypes.bool.isRequired,
    mapBeobNichtBeurteiltVisible: PropTypes.bool.isRequired,
    mapBeobNichtZuzuordnenVisible: PropTypes.bool.isRequired,
    mapPopVisible: PropTypes.bool.isRequired,
    mapTpopVisible: PropTypes.bool.isRequired,
    activeNodeArray: PropTypes.array.isRequired,
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
      // $FlowIssue
      this.tree.forceUpdateGrid()
    }
  }

  rowRenderer = ({ key, index, style }) =>
    <Row
      key={key}
      index={index}
      style={style}
      tree={this.props.tree}
    />

  noRowsRenderer = () => {
    const { projektLoading } = this.props
    const message = (
      projektLoading ?
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
    const { nodes, activeNodeArray } = this.props
    const activeNodeIndex = findIndex(nodes, node =>
      isEqual(node.url, activeNodeArray)
    )
    // console.log(`Tree: activeNodeArray:`, activeNodeArray)
    // console.log(`Tree: nodes:`, nodes)
    // console.log(`Tree: activeNodeIndex:`, activeNodeIndex)

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
              {...nodes}
              // need to use innerRef because ListContainer is a styled component
              // $FlowIssue
              innerRef={(c) => { this.tree = c }}
            />
          }
        </AutoSizer>
      </Container>
    )
  }
}

export default enhance(Tree)
