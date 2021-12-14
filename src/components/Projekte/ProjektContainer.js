import React, {
  useContext,
  useRef,
  useCallback,
  useEffect,
  Suspense,
  useState,
} from 'react'
import styled from 'styled-components'
import SplitPane from 'react-split-pane'
import { observer } from 'mobx-react-lite'
import { useDebouncedCallback } from 'use-debounce'

import KarteOderNull from './KarteOderNull'
import TreeContainer from './TreeContainer'
import Daten from './Daten'
import Exporte from './Exporte'
import Filter from './Filter'
import storeContext from '../../storeContext'
import ApberForApFromAp from '../Print/ApberForApFromAp'
import ApberForYear from '../Print/ApberForYear'

const Container = styled.div`
  height: 100%;

  @media print {
    display: block;
    height: auto !important;
  }
`
/**
 * need to use || instead of ?? for height
 * because 0 was passed
 */
const StyledSplitPane = styled(SplitPane)`
  height: ${(props) => props['data-height'] || 1000}px !important;

  .Resizer {
    background: #388e3c;
    opacity: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }

  .Resizer.vertical {
    border-left: 3px solid #388e3c;
    cursor: col-resize;
    background-color: #388e3c;
  }

  .Resizer.vertical:hover {
    border-left: 2px solid rgba(0, 0, 0, 0.3);
    border-right: 2px solid rgba(0, 0, 0, 0.3);
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }
  .Pane2 {
    overflow: ${(props) => (props.overflow === 'auto' ? 'auto' : 'hidden')};
  }
`
const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const standardWidth = 500

const ProjektContainer = ({
  treeName,
  tabs: tabsPassed,
  nodes,
  treeLoading,
  treeRefetch,
}) => {
  const store = useContext(storeContext)
  const { isPrint } = store
  const {
    setTreeWidth,
    setFormWidth,
    setFilterWidth,
    setFormHeight,
    activeNodeArray,
  } = store[treeName]

  const [height, setHeight] = useState(1000)

  const showApberForAp =
    activeNodeArray.length === 7 &&
    activeNodeArray[4] === 'AP-Berichte' &&
    activeNodeArray[6] === 'print'
  const showApberForYear =
    activeNodeArray.length === 5 &&
    activeNodeArray[2] === 'AP-Berichte' &&
    activeNodeArray[4] === 'print'

  const containerEl = useRef(null)
  const treeEl = useRef(null)
  const datenEl = useRef(null)
  const filterEl = useRef(null)

  // remove 2 to treat all same
  const tabs = [...tabsPassed].map((t) => t.replace('2', ''))

  const setDimensions = useCallback(() => {
    console.log('ProjektContainer setting dimensions')
    setTreeWidth(treeEl?.current?.clientWidth ?? standardWidth)
    setFormWidth(datenEl?.current?.clientWidth ?? standardWidth)
    setFormHeight(containerEl?.current?.clientHeight ?? standardWidth)
    setHeight(containerEl?.current?.clientHeight ?? standardWidth)
    setFilterWidth(filterEl?.current?.clientWidth ?? standardWidth)
  }, [setFilterWidth, setFormHeight, setFormWidth, setTreeWidth])

  //console.log('ProjektContainer, formHeight:', height)

  const setDimensionsDebounced = useDebouncedCallback(setDimensions, 600)

  const onDragSplitter = useCallback(setDimensions, [setDimensions])

  // reset dimensions when window resizes
  useEffect(() => {
    window.addEventListener('resize', setDimensionsDebounced)
    return () => window.removeEventListener('resize', setDimensionsDebounced)
  }, [setDimensionsDebounced])

  // reset dimensions when tabs are toggled
  useEffect(() => {
    setDimensions()
  }, [tabs.length, isPrint, setDimensions])

  const elObj = {
    tree: (
      <InnerContainer ref={treeEl}>
        <TreeContainer
          treeName={treeName}
          nodes={nodes}
          treeLoading={treeLoading}
          treeRefetch={treeRefetch}
        />
      </InnerContainer>
    ),
    daten: (
      <InnerContainer ref={datenEl}>
        <Daten treeName={treeName} nodes={nodes} />
      </InnerContainer>
    ),
    filter: (
      <InnerContainer ref={filterEl}>
        <Filter treeName={treeName} />
      </InnerContainer>
    ),
    karte: (
      <InnerContainer>
        <Suspense fallback={<div>Lade...</div>}>
          <KarteOderNull treeName={treeName} />
        </Suspense>
      </InnerContainer>
    ),
    exporte: (
      <InnerContainer>
        <Exporte />
      </InnerContainer>
    ),
  }

  const paneSize = tabs[0] === 'tree' ? '33%' : '50%'

  if (showApberForYear) {
    const component = <ApberForYear />
    if (isPrint) return component
    return (
      <Container ref={containerEl}>
        <StyledSplitPane
          split="vertical"
          size={paneSize}
          minSize={100}
          onDragFinished={onDragSplitter}
          overflow="auto"
          data-height={height}
        >
          {elObj.tree}
          {component}
        </StyledSplitPane>
      </Container>
    )
  }

  if (showApberForAp) {
    const component = <ApberForApFromAp />
    if (isPrint) return component
    return (
      <Container ref={containerEl}>
        <StyledSplitPane
          split="vertical"
          size={paneSize}
          minSize={100}
          onDragFinished={onDragSplitter}
          overflow="auto"
          data-height={height}
        >
          {elObj.tree}
          <InnerContainer>{component}</InnerContainer>
        </StyledSplitPane>
      </Container>
    )
  }

  if (isPrint) {
    return <Daten treeName={treeName} nodes={nodes} />
  }

  if (tabs.length < 2) {
    // return WITH split pane
    // otherwise height is wrong
    // and opening / closing tabs is slow
    // add empty div to prevent split-pane from
    // missing a second div
    return (
      <Container ref={containerEl}>
        <StyledSplitPane
          split="vertical"
          size="100%"
          minSize={100}
          onDragFinished={onDragSplitter}
          data-height={height}
        >
          {elObj[tabs[0]]}
          <></>
        </StyledSplitPane>
      </Container>
    )
  }

  if (tabs.length === 2) {
    return (
      <Container ref={containerEl}>
        <StyledSplitPane
          split="vertical"
          size={paneSize}
          minSize={100}
          onDragFinished={onDragSplitter}
          data-height={height}
        >
          {elObj[tabs[0]]}
          {elObj[tabs[1]]}
        </StyledSplitPane>
      </Container>
    )
  }

  if (tabs.length === 3) {
    return (
      <Container ref={containerEl}>
        <StyledSplitPane
          split="vertical"
          size="33%"
          minSize={100}
          onDragFinished={onDragSplitter}
          data-height={height}
        >
          {elObj[tabs[0]]}

          <StyledSplitPane
            split="vertical"
            size="50%"
            minSize={100}
            onDragFinished={onDragSplitter}
            data-height={height}
          >
            {elObj[tabs[1]]}
            {elObj[tabs[2]]}
          </StyledSplitPane>
        </StyledSplitPane>
      </Container>
    )
  }

  if (tabs.length === 4) {
    return (
      <Container ref={containerEl}>
        <StyledSplitPane
          split="vertical"
          size="25%"
          minSize={100}
          onDragFinished={onDragSplitter}
          data-height={height}
        >
          {elObj[tabs[0]]}

          <StyledSplitPane
            split="vertical"
            size="33%"
            minSize={100}
            onDragFinished={onDragSplitter}
            data-height={height}
          >
            {elObj[tabs[1]]}
            <StyledSplitPane
              split="vertical"
              size="50%"
              minSize={100}
              onDragFinished={onDragSplitter}
              data-height={height}
            >
              {elObj[tabs[2]]}
              {elObj[tabs[3]]}
            </StyledSplitPane>
          </StyledSplitPane>
        </StyledSplitPane>
      </Container>
    )
  }

  if (tabs.length === 5) {
    return (
      <Container ref={containerEl}>
        <StyledSplitPane
          split="vertical"
          size="20%"
          onDragFinished={onDragSplitter}
          minSize={100}
          data-height={height}
        >
          {elObj[tabs[0]]}

          <StyledSplitPane
            split="vertical"
            size="25%"
            minSize={100}
            onDragFinished={onDragSplitter}
            data-height={height}
          >
            {elObj[tabs[1]]}
            <StyledSplitPane
              split="vertical"
              size="33%"
              minSize={100}
              onDragFinished={onDragSplitter}
              data-height={height}
            >
              {elObj[tabs[2]]}
              <StyledSplitPane
                split="vertical"
                size="50%"
                minSize={100}
                onDragFinished={onDragSplitter}
                data-height={height}
              >
                {elObj[tabs[3]]}
                {elObj[tabs[4]]}
              </StyledSplitPane>
            </StyledSplitPane>
          </StyledSplitPane>
        </StyledSplitPane>
      </Container>
    )
  }

  return null
}

export default observer(ProjektContainer)
