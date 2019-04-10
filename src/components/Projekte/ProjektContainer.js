// @flow
import React, {
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react'
import styled from 'styled-components'
import SplitPane from 'react-split-pane'
import { observer } from 'mobx-react-lite'

// when Karte was loaded async, it did not load,
// but only in production!
import Karte from './Karte'
import TreeContainer from './TreeContainer'
import Daten from './Daten'
import Exporte from './Exporte'
import Filter from './Filter'
import mobxStoreContext from '../../mobxStoreContext'

const Container = styled.div`
  display: flex;
  flex-direction: column;
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
    /*border-right: 1.5px solid #388e3c;*/
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
  .Pane {
    overflow: hidden;
  }
`
const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
`

const standardWidth = 500
const standardHeight = 800
const standardDimensions = { width: 500, height: 800 }

const ProjektContainer = ({
  treeName,
  tabs: tabsPassed,
  projekteTabs,
}: {
  treeName: String,
  tabs: Array<String>,
  projekteTabs: Array<String>,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { isPrint } = mobxStore

  const treeEl = useRef(null)
  const datenEl = useRef(null)
  const filterEl = useRef(null)
  const karteEl = useRef(null)

  const [treeDimensions, setTreeDimensions] = useState(standardDimensions)
  const [datenDimensions, setDatenDimensions] = useState(standardDimensions)
  const [filterDimensions, setFilterDimensions] = useState(standardDimensions)
  const [karteDimensions, setKarteDimensions] = useState(standardDimensions)

  // remove 2 to treat all same
  const tabs = [...tabsPassed].map(t => t.replace('2', ''))

  const setDimensions = useCallback(() => {
    if (treeEl.current && treeEl.current.clientWidth) {
      setTreeDimensions({
        width: treeEl.current.clientWidth,
        height: treeEl.current.clientHeight,
      })
    } else {
      setTreeDimensions(standardDimensions)
    }
    if (datenEl.current && datenEl.current.clientWidth) {
      setDatenDimensions({
        width: datenEl.current.clientWidth,
        height: datenEl.current.clientHeight,
      })
    } else {
      setDatenDimensions(standardDimensions)
    }
    if (filterEl.current && filterEl.current.clientWidth) {
      setFilterDimensions({
        width: filterEl.current.clientWidth,
        height: filterEl.current.clientHeight,
      })
    } else {
      setFilterDimensions(standardDimensions)
    }
    if (karteEl.current && karteEl.current.clientWidth) {
      setKarteDimensions({
        width: karteEl.current.clientWidth,
        height: karteEl.current.clientHeight,
      })
    } else {
      setKarteDimensions(standardDimensions)
    }
  }, [treeEl.current, datenEl.current, filterEl.current, karteEl.current])

  const onChange = useCallback(() => setDimensions())

  useEffect(() => {
    setDimensions()
  }, [tabs.length])

  if (isPrint) {
    return <Daten treeName={treeName} />
  }

  const elObj = {
    tree: (
      <InnerContainer ref={treeEl}>
        <TreeContainer treeName={treeName} dimensions={treeDimensions} />
      </InnerContainer>
    ),
    daten: (
      <InnerContainer ref={datenEl}>
        <Daten treeName={treeName} dimensions={datenDimensions} />
      </InnerContainer>
    ),
    filter: (
      <InnerContainer ref={filterEl}>
        <Filter treeName={treeName} dimensions={filterDimensions} />
      </InnerContainer>
    ),
    karte: (
      <InnerContainer ref={karteEl}>
        <Karte treeName={treeName} dimensions={karteDimensions} />
      </InnerContainer>
    ),
    exporte: (
      <InnerContainer>
        <Exporte />
      </InnerContainer>
    ),
  }

  console.log('ProjektContainer')

  if (tabs.length < 2) {
    return <Container>{elObj[tabs[0]]}</Container>
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
