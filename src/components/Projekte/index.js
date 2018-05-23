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
`

const Projekte = () => 
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`
      // need to clone projekteTabs because elements are sealed
      //const projekteTabs = clone(get(data, 'urlQuery.projekteTabs'))
      //const projekteTabs = get(data, 'urlQuery.projekteTabs')
      const projekteTabs = [...get(data, 'urlQuery.projekteTabs')]
      const contains2 = projekteTabs.some(t => t.includes('2'))
      console.log('Projekte 1:', {
        projekteTabs,
        projekteTabsOriginal: get(data, 'urlQuery.projekteTabs'),
        contains2,
        treeTabsLive: projekteTabs.filter(t => !t.includes('2')),
        projekteTabsLength: projekteTabs.length, 
        data
    })
      if (!contains2) return <ProjektContainer treeName="tree" tabs={projekteTabs} />

      // if daten and exporte are shown, only show exporte
      if (projekteTabs.includes('daten') && projekteTabs.includes('exporte')) {
        const i = projekteTabs.indexOf('daten')
        projekteTabs.splice(i, 1)
      }
      if (projekteTabs.includes('daten2') && projekteTabs.includes('exporte2')) {
        const i = projekteTabs.indexOf('daten2')
        projekteTabs.splice(i, 1)
      }
      let treeTabs = projekteTabs.filter(t => !t.includes('2'))
      let tree2Tabs = projekteTabs.filter(t => t.includes('2'))
      console.log('Projekte 2:', {
        treeTabs, 
        tree2Tabs, 
        treeTabsLength: treeTabs.length, 
        tree2TabsLength: tree2Tabs.length, 
        tree2Tabs0: tree2Tabs[0]
      })

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
                <ProjektContainer treeName="tree" tabs={projekteTabs.filter(t => !t.includes('2'))} />
              </ReflexElement>
              <ReflexSplitter key="treeSplitter" />
              <ReflexElement >
                <ProjektContainer treeName="tree2" tabs={projekteTabs.filter(t => t.includes('2'))} />
              </ReflexElement>
            </ReflexContainer>
          </ErrorBoundary>
        </Container>
      )
    }}
  </Query>

export default Projekte
