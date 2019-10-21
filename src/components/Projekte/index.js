import React, { useContext } from 'react'
import styled from 'styled-components'
import SplitPane from 'react-split-pane'
import intersection from 'lodash/intersection'
import { observer } from 'mobx-react-lite'

// when Karte was loaded async, it did not load,
// but only in production!
import ProjektContainer from './ProjektContainer'
import storeContext from '../../storeContext'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  @media print {
    height: auto !important;
    overflow: visible !important;
    display: block;
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
  .Pane {
    overflow: hidden;
  }
`
const treeTabValues = ['tree', 'daten', 'filter', 'karte', 'exporte']
const tree2TabValues = ['tree2', 'daten2', 'filter2', 'karte2', 'exporte2']

const Projekte = () => {
  const store = useContext(storeContext)
  const { isPrint, urlQuery } = store

  const { projekteTabs } = urlQuery
  const treeTabs = intersection(treeTabValues, projekteTabs)
  const tree2Tabs = intersection(tree2TabValues, projekteTabs)

  if (tree2Tabs.length === 0 || isPrint) {
    return (
      <Container>
        <ProjektContainer
          treeName="tree"
          tabs={treeTabs}
          projekteTabs={projekteTabs}
        />
      </Container>
    )
  }

  return (
    <Container>
      <StyledSplitPane split="vertical" defaultSize="50%">
        <ProjektContainer
          treeName="tree"
          tabs={treeTabs}
          projekteTabs={projekteTabs}
        />
        <ProjektContainer
          treeName="tree2"
          tabs={tree2Tabs}
          projekteTabs={projekteTabs}
        />
      </StyledSplitPane>
    </Container>
  )
}

export default observer(Projekte)
