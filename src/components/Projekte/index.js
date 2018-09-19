// @flow
import React from 'react'
import styled from 'styled-components'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import get from 'lodash/get'
import intersection from 'lodash/intersection'
import compose from 'recompose/compose'

// when Karte was loaded async, it did not load,
// but only in production!
import ErrorBoundary from '../shared/ErrorBoundary'
import withData from './withData'
import ProjektContainer from './ProjektContainer'

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

const enhance = compose(withData)

const Projekte = ({ data }: { data: Object }) => {
  if (data.error) return `Fehler: ${data.error.message}`
  const projekteTabs = get(data, 'urlQuery.projekteTabs', [])
  const treeTabs = intersection(treeTabValues, projekteTabs)
  const tree2Tabs = intersection(tree2TabValues, projekteTabs)
  const isPrint = get(data, 'isPrint')
  console.log('Projekte rendering')

  if (tree2Tabs.length === 0 || isPrint) {
    return (
      <ProjektContainer
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
          <ReflexElement flex={treeTabs.length / projekteTabs.length}>
            <ProjektContainer
              treeName="tree"
              tabs={treeTabs}
              projekteTabs={projekteTabs}
            />
          </ReflexElement>
          <ReflexSplitter />
          <ReflexElement>
            <ProjektContainer
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

export default enhance(Projekte)
