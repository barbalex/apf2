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
`
const treeTabValues = ['tree', 'daten', 'karte', 'exporte']
const tree2TabValues = ['tree2', 'daten2', 'karte2', 'exporte2']

const Projekte = () => 
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`
      
      const projekteTabs = get(data, 'urlQuery.projekteTabs')
      let treeTabs = intersection(treeTabValues, projekteTabs)
      let tree2Tabs = intersection(tree2TabValues, projekteTabs)
      // if daten and exporte are shown, only show exporte
      if (treeTabs.includes('daten') && treeTabs.includes('exporte')) {
        treeTabs = treeTabs.filter(t => t !== 'daten')
      }
      if (tree2Tabs.includes('daten2') && tree2Tabs.includes('exporte2')) {
        tree2Tabs = tree2Tabs.filter(t => t !== 'daten2')
      }
      if (tree2Tabs.length === 0) {
        return <ProjektContainer treeName="tree" tabs={treeTabs} />
      }

      return (
        <Container>
          <ErrorBoundary>
            <ReflexContainer orientation="vertical">
              <ReflexElement flex={treeTabs.length / projekteTabs.length} >
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
