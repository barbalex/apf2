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
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }

  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }

  .Resizer.vertical {
    width: 5px;
    margin: 0 -3px;
    border-left: 3px solid #388e3c;
    border-right: 3px solid #388e3c;
    cursor: col-resize;
    background-color: #388e3c;
  }

  .Resizer.vertical:hover {
    border-left: 3px solid rgba(0, 0, 0, 0.3);
    border-right: 3px solid rgba(0, 0, 0, 0.3);
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }
`
const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
`

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

  const el = useRef(null)
  const treeEl = useRef(null)
  const datenEl = useRef(null)
  const filterEl = useRef(null)
  const karteEl = useRef(null)
  const exporteEl = useRef(null)

  const [treeWidth, setTreeWidth] = useState(0)
  const [treeHeight, setTreeHeight] = useState(0)
  const [datenWidth, setDatenWidth] = useState(0)
  const [datenHeight, setDatenHeight] = useState(0)
  const [filterWidth, setFilterWidth] = useState(0)
  const [filterHeight, setFilterHeight] = useState(0)
  const [karteWidth, setKarteWidth] = useState(0)
  const [karteHeight, setKarteHeight] = useState(0)
  const [exporteWidth, setExporteWidth] = useState(0)
  const [exporteHeight, setExporteHeight] = useState(0)

  const onChange = useCallback(() => {
    if (treeEl.current) {
      setTreeWidth(treeEl.current.clientWidth)
      setTreeHeight(treeEl.current.clientHeight)
    }
    if (datenEl.current) {
      setDatenWidth(datenEl.current.clientWidth)
      setDatenHeight(datenEl.current.clientHeight)
    }
    if (filterEl.current) {
      setFilterWidth(filterEl.current.clientWidth)
      setFilterHeight(filterEl.current.clientHeight)
    }
    if (karteEl.current) {
      setKarteWidth(karteEl.current.clientWidth)
      setKarteHeight(karteEl.current.clientHeight)
    }
    if (exporteEl.current) {
      setExporteWidth(exporteEl.current.clientWidth)
      setExporteHeight(exporteEl.current.clientHeight)
    }
  })

  useEffect(() => {
    if (treeEl.current) {
      setTreeWidth(treeEl.current.clientWidth)
      setTreeHeight(treeEl.current.clientHeight)
    }
    if (datenEl.current) {
      setDatenWidth(datenEl.current.clientWidth)
      setDatenHeight(datenEl.current.clientHeight)
    }
    if (filterEl.current) {
      setFilterWidth(filterEl.current.clientWidth)
      setFilterHeight(filterEl.current.clientHeight)
    }
    if (karteEl.current) {
      setKarteWidth(karteEl.current.clientWidth)
      setKarteHeight(karteEl.current.clientHeight)
    }
    if (exporteEl.current) {
      setExporteWidth(exporteEl.current.clientWidth)
      setExporteHeight(exporteEl.current.clientHeight)
    }
  }, [])

  if (isPrint) {
    return <Daten treeName={treeName} />
  }

  // remove 2 to treat all same
  const tabs = [...tabsPassed].map(t => t.replace('2', ''))
  const defaultSize =
    projekteTabs.length === 2 && tabs.length === 2
      ? '33%'
      : tabs.length === 0
      ? '100%'
      : `${(1 / tabs.length) * 100}%`

  const elObj = {
    tree: (
      <InnerContainer ref={treeEl}>
        <TreeContainer
          treeName={treeName}
          dimensions={{ width: treeWidth, height: treeHeight }}
        />
      </InnerContainer>
    ),
    daten: (
      <InnerContainer ref={datenEl}>
        <Daten
          treeName={treeName}
          dimensions={{ width: datenWidth, height: datenHeight }}
        />
      </InnerContainer>
    ),
    filter: (
      <InnerContainer ref={filterEl}>
        <Filter
          treeName={treeName}
          dimensions={{ width: filterWidth, height: filterHeight }}
        />
      </InnerContainer>
    ),
    karte: (
      <InnerContainer ref={karteEl}>
        <Karte
          treeName={treeName}
          dimensions={{ width: karteWidth, height: karteHeight }}
        />
      </InnerContainer>
    ),
    exporte: (
      <InnerContainer ref={exporteEl}>
        <Exporte dimensions={{ width: exporteWidth, height: exporteHeight }} />
      </InnerContainer>
    ),
  }

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

  return (
    <Container>
      <StyledSplitPane
        split="vertical"
        defaultSize={defaultSize}
        onDragFinished={onChange}
      >
        {tabs.includes('tree') && (
          <InnerContainer ref={treeEl}>
            <TreeContainer
              treeName={treeName}
              dimensions={{ width: treeWidth, height: treeHeight }}
            />
          </InnerContainer>
        )}
        {tabs.includes('daten') && (
          <InnerContainer ref={datenEl}>
            <Daten
              treeName={treeName}
              dimensions={{ width: datenWidth, height: datenHeight }}
            />
          </InnerContainer>
        )}
        {tabs.includes('filter') && (
          <InnerContainer ref={filterEl}>
            <Filter
              treeName={treeName}
              dimensions={{ width: filterWidth, height: filterHeight }}
            />
          </InnerContainer>
        )}
        {tabs.includes('karte') && (
          <InnerContainer ref={karteEl}>
            <Karte
              treeName={treeName}
              dimensions={{ width: karteWidth, height: karteHeight }}
            />
          </InnerContainer>
        )}
        {tabs.includes('exporte') && (
          <InnerContainer ref={exporteEl}>
            <Exporte
              dimensions={{ width: exporteWidth, height: exporteHeight }}
            />
          </InnerContainer>
        )}
      </StyledSplitPane>
    </Container>
  )
}

export default observer(ProjektContainer)
