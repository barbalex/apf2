import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
// 2022 02 08: removed simplebar as was hard to get to work with virtuoso
// see: https://github.com/petyosi/react-virtuoso/issues/253
import { Virtuoso } from 'react-virtuoso'

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

const Tree = ({ treeName, nodes }) => {
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
    if (index > -1 && initialTopMostIndex === undefined) {
      setInitialTopMostIndex(index)
    }
  }, [nodes, urlToFocus, initialTopMostIndex])

  // only return once initial top most index is clear (better performance)
  if (initialTopMostIndex === undefined) return null

  return (
    <Container>
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
