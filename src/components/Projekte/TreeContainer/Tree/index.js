import React, { useContext, useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'

import Row from './Row'

import storeContext from '../../../../storeContext'

const singleRowHeight = 23
const Container = styled.div`
  height: 100%;
  cursor: ${props => (props['data-loading'] ? 'wait' : 'inherit')};
  ul {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1.1em;
  }
`
const StyledList = styled(List)`
  overflow-x: hidden !important;
`

const Tree = ({ treeName, nodes, loading }) => {
  const store = useContext(storeContext)
  const tree = store[treeName]
  const { activeNodeArray, treeWidth, treeHeight } = tree

  const listRef = React.createRef()

  useEffect(() => {
    if (listRef && listRef.current) {
      const index = findIndex(nodes, node => isEqual(node.url, activeNodeArray))
      listRef.current.scrollToItem(index)
    }
  }, [activeNodeArray, listRef, nodes, loading])

  //console.log('Tree rendering')

  return (
    <Container data-loading={loading}>
      <StyledList
        height={treeHeight - 64 - 64}
        itemCount={nodes.length}
        itemSize={singleRowHeight}
        width={treeWidth}
        ref={listRef}
      >
        {({ index, style }) => (
          <Row
            key={index}
            style={style}
            index={index}
            node={nodes[index]}
            treeName={treeName}
          />
        )}
      </StyledList>
    </Container>
  )
}

export default observer(Tree)
