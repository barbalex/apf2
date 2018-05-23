// @flow
import React from 'react'
import styled from 'styled-components'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Query } from 'react-apollo'
import get from 'lodash/get'

// when Karte was loaded async, it did not load,
// but only in production!
import ErrorBoundary from '../shared/ErrorBoundary'
import dataGql from './data.graphql'
import ProjektContainer from './ProjektContainer'


const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 49.3px);
`

const Projekte = () => 
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`
      const projekteTabs = get(data, 'urlQuery.projekteTabs')
      let treeTabs = projekteTabs.filter(t => !t.includes('2'))
      let tree2Tabs = projekteTabs.filter(t => t.includes('2'))
      // if daten and exporte are shown, only show exporte
      if (treeTabs.includes('daten') && treeTabs.includes('exporte')) {
        treeTabs = treeTabs.filter(t => t !== 'daten')
      }
      if (tree2Tabs.includes('daten2') && tree2Tabs.includes('exporte2')) {
        tree2Tabs = tree2Tabs.filter(t => t !== 'daten2')
      }
      //const contains2 = projekteTabs.some(t => t.includes('2'))
      const contains2 = tree2Tabs.length > 0
      console.log('Projekte 1:', {
        projekteTabs,
        projekteTabsOriginal: get(data, 'urlQuery.projekteTabs'),
        contains2,
        treeTabsLive: projekteTabs.filter(t => !t.includes('2')),
        projekteTabsLength: projekteTabs.length, 
        data,
        treeTabs, 
        tree2Tabs, 
        treeTabsLength: treeTabs.length, 
        tree2TabsLength: tree2Tabs.length, 
        tree2Tabs0: tree2Tabs[0],
        tree2TabsLive: projekteTabs.filter(t => t.includes('2')),
    })
      if (!contains2) return <ProjektContainer treeName="tree" tabs={treeTabs} />

      let flex = treeTabs.length / tree2Tabs.length
      if (projekteTabs.length === 2 && projekteTabs.includes('tree') && projekteTabs.includes('tree2')) {
        // prevent 0.33 of screen being empty
        flex = 0.5
      }

      return (
        <Container>
          <ErrorBoundary>
            <ReflexContainer orientation="vertical">
              <ReflexElement flex={flex} >
                <ProjektContainer treeName="tree" tabs={treeTabs} />
              </ReflexElement>
              <ReflexSplitter key="treeSplitter" />
              <ReflexElement >
                <ProjektContainer treeName="tree2" tabs={tree2Tabs} />
              </ReflexElement>
            </ReflexContainer>
          </ErrorBoundary>
        </Container>
      )
    }}
  </Query>

export default Projekte
