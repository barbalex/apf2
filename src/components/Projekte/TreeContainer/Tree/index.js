// @flow
import React, { useContext, useCallback } from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import styled from 'styled-components'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import Row from './Row'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import mobxStoreContext from '../../../../mobxStoreContext'

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
  treeName: String,
  data: Object,
  mapBeobZugeordnetVisible: boolean,
  mapBeobNichtBeurteiltVisible: boolean,
  mapBeobNichtZuzuordnenVisible: boolean,
  mapPopVisible: boolean,
  mapTpopVisible: boolean,
}

const noRowsRenderer = () => (
  <Container>
    <LoadingDiv>lade Daten...</LoadingDiv>
  </Container>
)

const Tree = ({ data, treeName }: Props) => {
  // TODO:
  // when beob.artId is changed, saveArtIdToDb changes openNodes
  // problem is: Tree renders AFTERWARDS with OLD openNodes !!!???
  //console.log('Tree rendering')
  const mobxStore = useContext(mobxStoreContext)
  const tree = mobxStore[treeName]
  const { activeNodeArray, nodes } = tree
  const rowRenderer = useCallback(
    ({ key, index, style }) => {
      const node = getSnapshot(nodes[index])

      return (
        <Row
          key={key}
          style={style}
          index={index}
          node={node}
          data={data}
          treeName={treeName}
        />
      )
    },
    [data, treeName],
  )

  return (
    <ErrorBoundary>
      <Container>
        <AutoSizer>
          {({ height, width }) => (
            <ListContainer
              height={height}
              rowCount={nodes.length}
              rowHeight={singleRowHeight}
              rowRenderer={rowRenderer}
              noRowsRenderer={noRowsRenderer}
              scrollToIndex={findIndex(nodes, node =>
                isEqual(node.url, activeNodeArray),
              )}
              width={width}
            />
          )}
        </AutoSizer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tree)
