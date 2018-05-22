// @flow
import React from 'react'
import styled from 'styled-components'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import clone from 'lodash/clone'

// when Karte was loaded async, it did not load,
// but only in production!
import ErrorBoundary from '../shared/ErrorBoundary'
import dataGql from './data.graphql'
import ProjektContainer from './ProjektContainer'


const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 49.3px);
  cursor: ${props => (props['data-loading'] ? 'wait' : 'inherit')};
`

const Projekte = () => 
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`
      // need to clone projekteTabs because elements are sealed
      const projekteTabs = clone(get(data, 'urlQuery.projekteTabs'))
      const contains2 = projekteTabs.some(t => ['tree2', 'daten2', 'karte2', 'exporte2'].includes(t))
      if (!contains2) return <ProjektContainer treeName="tree" />

      // if daten and exporte are shown, only show exporte
      if (projekteTabs.includes('daten') && projekteTabs.includes('exporte')) {
        const i = projekteTabs.indexOf('daten')
        projekteTabs.splice(i, 1)
      }
      if (projekteTabs.includes('daten2') && projekteTabs.includes('exporte2')) {
        const i = projekteTabs.indexOf('daten2')
        projekteTabs.splice(i, 1)
      }
      const treeTabs = projekteTabs.filter(t => ['tree', 'daten', 'karte', 'exporte'].includes(t))
      const tree2Tabs = projekteTabs.filter(t => ['tree2', 'daten2', 'karte2', 'exporte2'].includes(t))

      const flex = treeTabs.length / tree2Tabs.length

      return (
        <Container data-loading={loading}>
          <ErrorBoundary>
            <ReflexContainer orientation="vertical">
              <ReflexElement flex={flex} >
                <ProjektContainer treeName="tree" />
              </ReflexElement>
              <ReflexSplitter key="treeSplitter" />
              <ReflexElement >
                <ProjektContainer treeName="tree2" />
              </ReflexElement>
            </ReflexContainer>
          </ErrorBoundary>
        </Container>
      )
    }}
  </Query>

export default Projekte
