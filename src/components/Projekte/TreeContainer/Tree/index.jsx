import React, { useContext, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
// 2022 02 08: removed simplebar as was hard to get to work with virtuoso
// see: https://github.com/petyosi/react-virtuoso/issues/253
// import { Virtuoso } from 'react-virtuoso'
import { Tree } from 'react-arborist'
// import AutoSizer from 'react-virtualized-auto-sizer'
import { useResizeDetector } from 'react-resize-detector'

import Row from './Row'

import storeContext from '../../../../storeContext'

const Container = styled.div`
  height: calc(100% - 53px - 8px);
  width: 100%;

  ul {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1.1em;
  }
`

const TreeComponent = ({ nodes }) => {
  const store = useContext(storeContext)
  const tree = store.tree
  const { activeNodeArray, lastTouchedNode: lastTouchedNodeProxy } = tree

  const {
    height = 500,
    width = 500,
    ref: resizeRef,
  } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
    refreshOptions: { leading: true },
  })

  const lastTouchedNode = lastTouchedNodeProxy?.slice()
  // when loading on url, lastTouchedNode may not be set
  const urlToFocus = lastTouchedNode.length ? lastTouchedNode : activeNodeArray
  const [initialTopMostIndex, setInitialTopMostIndex] = useState(undefined)

  useEffect(() => {
    const index = findIndex(nodes, (node) => isEqual(node.url, urlToFocus))
    const indexToSet = index === -1 ? 0 : index
    //console.log('Tree, effect:', { nodes, index, urlToFocus, indexToSet })
    if (initialTopMostIndex === undefined) {
      setInitialTopMostIndex(indexToSet)
    }
  }, [nodes, urlToFocus, initialTopMostIndex])

  //console.log('Tree, height:', { height, initialTopMostIndex })

  // only return once initial top most index is clear (better performance)
  if (initialTopMostIndex === undefined) return null

  return (
    <Container ref={resizeRef}>
      <Tree
        key={JSON.stringify(nodes)}
        data={nodes}
        height={height}
        width={width}
      >
        {({ node, style, tree, dragHandle }) => (
          <Row
            node={node}
            style={style}
            tree={tree}
            dragHandle={dragHandle}
            nodes={nodes}
          />
        )}
      </Tree>
    </Container>
  )
}

export default observer(TreeComponent)
