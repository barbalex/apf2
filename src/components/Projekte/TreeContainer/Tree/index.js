import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
// 2022 02 08: removed simplebar as was hard to get to work with virtuoso
// see: https://github.com/petyosi/react-virtuoso/issues/253
import { Virtuoso } from 'react-virtuoso'

import Row from './Row'

import storeContext from '../../../../storeContext'
import { initial } from 'lodash'

const Container = styled.div`
  height: calc(100% - 53px - 8px);
  width: 100%;

  cursor: ${(props) => (props['data-loading'] ? 'wait' : 'inherit')};
  ul {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1.1em;
  }
`

const Tree = ({ treeName, nodes, loading }) => {
  const store = useContext(storeContext)
  const tree = store[treeName]
  const {
    activeNodeArray,
    lastTouchedNode: lastTouchedNodeProxy,
    formHeight: height,
  } = tree

  const lastTouchedNode = lastTouchedNodeProxy?.slice()
  // when loading on url, lastTouchedNode may not be set
  const urlToFocus = lastTouchedNode.length ? lastTouchedNode : activeNodeArray
  const [initialTopMostIndex, setInitialTopMostIndex] = useState(undefined)

  useEffect(() => {
    const index = findIndex(nodes, (node) => isEqual(node.url, urlToFocus))
    console.log('useEffect, index:', index)
    if (index >= 0 && initialTopMostIndex !== undefined) {
      console.log('setting initialTopMostIndex to index:', index)
      setInitialTopMostIndex(index)
    }
  }, [nodes, loading, urlToFocus, initialTopMostIndex])

  if (initialTopMostIndex === undefined) return null

  return (
    <Container data-loading={loading}>
      <Virtuoso
        initialTopMostItemIndex={initialTopMostIndex}
        height={height}
        totalCount={nodes.length}
        itemContent={(index) => (
          <Row key={index} node={nodes[index]} treeName={treeName} />
        )}
      />
    </Container>
  )
}

export default observer(Tree)
