import React, { useContext, useRef, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import SplitPane from 'react-split-pane'
import { observer } from 'mobx-react-lite'

// when Karte was loaded async, it did not load,
// but only in production!
//import Karte from "./Karte"
import KarteOrNull from './KarteOrNull'
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
const StyledSplitPane = styled(SplitPane)`
  .Resizer {
    background: #388e3c;
    opacity: 1;
    z-index: 1;
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
    overflow: ${props => (props.overflow === 'auto' ? 'auto' : 'hidden')};
  }
`
const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const standardWidth = 500
const standardHeight = 800

const ProjektContainer = ({ treeName, tabs: tabsPassed, projekteTabs }) => {
  const store = useContext(storeContext)
  const { isPrint } = store
  const {
    setTreeWidth,
    setTreeHeight,
    setDatenWidth,
    setFilterWidth,
    activeNodeArray,
  } = store[treeName]

  const showApberForAp =
    activeNodeArray.length === 7 &&
    activeNodeArray[4] === 'AP-Berichte' &&
    activeNodeArray[6] === 'print'
  const showApberForYear =
    activeNodeArray.length === 5 &&
    activeNodeArray[2] === 'AP-Berichte' &&
    activeNodeArray[4] === 'print'

  const treeEl = useRef(null)
  const datenEl = useRef(null)
  const filterEl = useRef(null)

  // remove 2 to treat all same
  const tabs = [...tabsPassed].map(t => t.replace('2', ''))

  const setDimensions = useCallback(() => {
    if (treeEl.current && treeEl.current.clientWidth) {
      setTreeWidth(treeEl.current.clientWidth)
      setTreeHeight(treeEl.current.clientHeight)
    } else {
      setTreeWidth(standardWidth)
      setTreeHeight(standardHeight)
    }
    if (datenEl.current && datenEl.current.clientWidth) {
      setDatenWidth(datenEl.current.clientWidth)
    } else {
      setDatenWidth(standardWidth)
    }
    if (filterEl.current && filterEl.current.clientWidth) {
      setFilterWidth(filterEl.current.clientWidth)
    } else {
      setFilterWidth(standardWidth)
    }
  }, [treeEl.current, datenEl.current, filterEl.current])

  const onChange = useCallback(() => setDimensions())

  // reset dimensions when window resizes
  useEffect(() => {
    window.addEventListener('resize', setDimensions)
    return () => window.removeEventListener('resize', setDimensions)
  }, [])

  // reset dimensions when tabs are toggled
  useEffect(() => {
    setDimensions()
  }, [tabs.length, isPrint])

  if (isPrint && showApberForAp) {
    return <ApberForApFromAp />
  }

  if (isPrint && showApberForYear) {
    return <ApberForYear />
  }

  if (isPrint) {
    return <Daten treeName={treeName} />
  }

  const elObj = {
    tree: (
      <InnerContainer ref={treeEl}>
        <TreeContainer treeName={treeName} />
      </InnerContainer>
    ),
    daten: (
      <InnerContainer ref={datenEl}>
        <Daten treeName={treeName} />
      </InnerContainer>
    ),
    filter: (
      <InnerContainer ref={filterEl}>
        <Filter treeName={treeName} />
      </InnerContainer>
    ),
    karte: (
      <InnerContainer>
        <KarteOrNull treeName={treeName} />
      </InnerContainer>
    ),
    exporte: (
      <InnerContainer>
        <Exporte />
      </InnerContainer>
    ),
  }

  if (showApberForAp) {
    return (
      <Container>
        <StyledSplitPane
          split="vertical"
          size={tabs[0] === 'tree' ? '33%' : '50%'}
          minSize={100}
          onDragFinished={onChange}
          overflow="auto"
        >
          {elObj.tree}
          <InnerContainer>
            <ApberForApFromAp />
          </InnerContainer>
        </StyledSplitPane>
      </Container>
    )
  }

  if (showApberForYear) {
    return (
      <Container>
        <StyledSplitPane
          split="vertical"
          size={tabs[0] === 'tree' ? '33%' : '50%'}
          minSize={100}
          onDragFinished={onChange}
          overflow="auto"
        >
          {elObj.tree}
          <ApberForYear />
        </StyledSplitPane>
      </Container>
    )
  }

  if (tabs.length < 2) {
    // return WITH split pane
    // otherwise height is wrong
    // and opening / closing tabs is slow
    return (
      <Container>
        <StyledSplitPane
          split="vertical"
          size="100%"
          minSize={100}
          onDragFinished={onChange}
        >
          {elObj[tabs[0]]}
        </StyledSplitPane>
      </Container>
    )
  }

  if (tabs.length === 2) {
    return (
      <Container>
        <StyledSplitPane
          split="vertical"
          size={tabs[0] === 'tree' ? '33%' : '50%'}
          minSize={100}
          onDragFinished={onChange}
        >
          {elObj[tabs[0]]}
          {elObj[tabs[1]]}
        </StyledSplitPane>
      </Container>
    )
  }

  if (tabs.length === 3) {
    return (
      <Container>
        <StyledSplitPane
          split="vertical"
          size="33%"
          minSize={100}
          onDragFinished={onChange}
        >
          {elObj[tabs[0]]}

          <StyledSplitPane
            split="vertical"
            size="50%"
            minSize={100}
            onDragFinished={onChange}
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
      <Container>
        <StyledSplitPane
          split="vertical"
          size="25%"
          minSize={100}
          onDragFinished={onChange}
        >
          {elObj[tabs[0]]}

          <StyledSplitPane
            split="vertical"
            size="33%"
            minSize={100}
            onDragFinished={onChange}
          >
            {elObj[tabs[1]]}
            <StyledSplitPane
              split="vertical"
              size="50%"
              minSize={100}
              onDragFinished={onChange}
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
      <Container>
        <StyledSplitPane
          split="vertical"
          size="20%"
          onDragFinished={onChange}
          minSize={100}
        >
          {elObj[tabs[0]]}

          <StyledSplitPane
            split="vertical"
            size="25%"
            minSize={100}
            onDragFinished={onChange}
          >
            {elObj[tabs[1]]}
            <StyledSplitPane
              split="vertical"
              size="33%"
              minSize={100}
              onDragFinished={onChange}
            >
              {elObj[tabs[2]]}
              <StyledSplitPane
                split="vertical"
                size="50%"
                minSize={100}
                onDragFinished={onChange}
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
