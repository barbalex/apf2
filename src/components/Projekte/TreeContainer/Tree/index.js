// @flow
import React, { useContext, useCallback } from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import styled from 'styled-components'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'

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
  openNodes: Array<string>,
  mapIdsFiltered: Array<String>,
}

const noRowsRenderer = () => (
  <Container>
    <LoadingDiv>lade Daten...</LoadingDiv>
  </Container>
)

const Tree = ({
  nodes,
  activeNodeArray,
  loading,
  moving,
  openNodes,
  data,
  tree,
  treeName,
  activeNodes,
  mapIdsFiltered,
}: Props) => {
  // TODO:
  // when beob.artId is changed, saveArtIdToDb changes openNodes
  // problem is: Tree renders AFTERWARDS with OLD openNodes !!!???
  //console.log('Tree rendering')
  const { mapFilter, activeApfloraLayers } = useContext(mobxStoreContext)
  const rowRenderer = useCallback(
    ({ key, index, style }) => {
      const node = nodes[index]

      return (
        <Row
          key={key}
          style={style}
          index={index}
          tree={tree}
          openNodes={openNodes}
          activeNodes={activeNodes}
          node={node}
          data={data}
          treeName={treeName}
          moving={moving}
          mapIdsFiltered={mapIdsFiltered}
        />
      )
    },
    [tree, openNodes, activeNodes, data, treeName, moving, mapIdsFiltered],
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
              // force rerender when:
              // ...second query finisches
              // TODO: is this loading needed?
              loading={loading}
              // ...after copying and moving
              //copying={copying}
              moving={moving}
              openNodes={openNodes}
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

export default observer(Tree)
