// @flow
import React, { useContext } from 'react'
import styled from 'styled-components'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import intersection from 'lodash/intersection'
import { observer } from 'mobx-react-lite'

// when Karte was loaded async, it did not load,
// but only in production!
import ErrorBoundary from '../shared/ErrorBoundary'
import ProjektContainerContainer from './ProjektContainerContainer'
import mobxStoreContext from '../../mobxStoreContext'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 49.3px);
  @media print {
    height: auto !important;
    display: block;
  }
`
const treeTabValues = ['tree', 'daten', 'karte', 'exporte']
const tree2TabValues = ['tree2', 'daten2', 'karte2', 'exporte2']

const Projekte = () => {
  const mobxStore = useContext(mobxStoreContext)
  const { isPrint, urlQuery } = mobxStore

  const { projekteTabs } = urlQuery
  const treeTabs = intersection(treeTabValues, projekteTabs)
  const tree2Tabs = intersection(tree2TabValues, projekteTabs)

  if (tree2Tabs.length === 0 || isPrint) {
    return (
      <ProjektContainerContainer
        treeName="tree"
        tabs={treeTabs}
        projekteTabs={projekteTabs}
      />
    )
  }

  return (
    <Container>
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          <ReflexElement
            flex={treeTabs.length / projekteTabs.length}
            propagateDimensions={true}
          >
            <ProjektContainerContainer
              treeName="tree"
              tabs={treeTabs}
              projekteTabs={projekteTabs}
            />
          </ReflexElement>
          <ReflexSplitter />
          <ReflexElement>
            <ProjektContainerContainer
              treeName="tree2"
              tabs={tree2Tabs}
              projekteTabs={projekteTabs}
            />
          </ReflexElement>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(Projekte)
