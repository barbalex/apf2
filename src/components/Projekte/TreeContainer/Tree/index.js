import React, { useContext, useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'
import { withResizeDetector } from 'react-resize-detector'

import Row from './Row'

import storeContext from '../../../../storeContext'

const singleRowHeight = 23
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
const StyledList = styled(List)`
  overflow-x: hidden !important;

  /* hide native scrollbar */
  &::-webkit-scrollbar {
    width: 0;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    box-shadow: none;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    box-shadow: none;
  }
`

const Tree = ({ treeName, nodes, loading, height = 1000 }) => {
  const store = useContext(storeContext)
  const tree = store[treeName]
  const {
    activeNodeArray,
    treeWidth,
    lastTouchedNode: lastTouchedNodeProxy,
  } = tree

  const listRef = React.createRef()
  const lastTouchedNode = lastTouchedNodeProxy?.slice()
  // when loading on url, lastTouchedNode may not be set
  const urlToFocus = lastTouchedNode.length ? lastTouchedNode : activeNodeArray

  useEffect(() => {
    if (listRef && listRef.current) {
      const index = findIndex(nodes, (node) => isEqual(node.url, urlToFocus))
      listRef.current.scrollToItem(index)
    }
  }, [listRef, nodes, loading, urlToFocus])

  return (
    <Container data-loading={loading}>
      <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
        {({ scrollableNodeRef, contentNodeRef }) => (
          <StyledList
            height={height}
            itemCount={nodes.length}
            itemSize={singleRowHeight}
            width={treeWidth}
            ref={listRef}
            innerRef={contentNodeRef}
            outerRef={scrollableNodeRef}
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
        )}
      </SimpleBar>
    </Container>
  )
}

export default withResizeDetector(observer(Tree))
