// @flow
import React from 'react'
import styled from 'styled-components'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import intersection from 'lodash/intersection'

// when Karte was loaded async, it did not load,
// but only in production!
import ErrorBoundary from '../shared/ErrorBoundary'
import dataGql from './data.graphql'
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

const Projekte = ({
  showDeletions,
  setShowDeletions,
}: {
  showDeletions: Boolean,
  setShowDeletions: () => void,
}) => (
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`

      const projekteTabs = get(data, 'urlQuery.projekteTabs', [])
      const treeTabs = intersection(treeTabValues, projekteTabs)
      const tree2Tabs = intersection(tree2TabValues, projekteTabs)
      if (tree2Tabs.length === 0) {
        return (
          <ProjektContainer
            treeName="tree"
            tabs={treeTabs}
            projekteTabs={projekteTabs}
            showDeletions={showDeletions}
            setShowDeletions={setShowDeletions}
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
                  showDeletions={showDeletions}
                  setShowDeletions={setShowDeletions}
                />
              </ReflexElement>
              <ReflexSplitter />
              <ReflexElement>
                <ProjektContainer
                  treeName="tree2"
                  tabs={tree2Tabs}
                  projekteTabs={projekteTabs}
                  showDeletions={showDeletions}
                  setShowDeletions={setShowDeletions}
                />
              </ReflexElement>
            </ReflexContainer>
          </ErrorBoundary>
        </Container>
      )
    }}
  </Query>
)

export default Projekte
