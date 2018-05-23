// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import merge from 'lodash/merge'
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'

// when Karte was loaded async, it did not load,
// but only in production!
import Karte from '../Karte'
import ErrorBoundary from '../../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'
import TreeContainer from '../TreeContainer'
import Daten from '../Daten'
import Exporte from '../Exporte'
import getActiveNodes from '../../../modules/getActiveNodes'
import variables from './variables'
import buildNodes from '../TreeContainer/nodes'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: ${props => (props['data-loading'] ? 'wait' : 'inherit')};
`
const KarteContainer = styled.div`
  border-left-color: rgb(46, 125, 50);
  border-left-width: 1px;
  border-left-style: solid;
  border-right-color: rgb(46, 125, 50);
  border-right-width: 1px;
  border-right-style: solid;
  height: 100%;
  overflow: hidden;
`

const enhance = compose(inject('store'), observer)

const myChildren = ({
  store,
  data,
  treeName,
  tabs: tabsPassed,
  activeNodes,
  client
}:{
  store: Object,
  data: Object,
  treeName: String,
  tabs: Array<String>,
  activeNodes: Object,
  client: Object
}) => {
  const nodes = buildNodes({ data, treeName })
  const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
  const activeNode = nodes.find(n => isEqual(n.url, activeNodeArray))
  // if daten and exporte are shown, only show exporte
  const tabs = clone(tabsPassed)
  if (tabs.includes('daten') && tabs.includes('exporte')) {
    const i = tabs.indexOf('daten')
    tabs.splice(i, 1)
  }
  if (tabs.includes('daten2') && tabs.includes('exporte2')) {
    const i = tabs.indexOf('daten2')
    tabs.splice(i, 1)
  }

  const children = []
  let flex
  switch (tabs.length) {
    case 0:
      flex = 1
      break
    case 2: {
      if (tabs.includes('tree') && tabs.includes('tree2')) {
        // prevent 0.33 of screen being empty
        flex = 0.5
      } else {
        flex = 0.33
      }
      break
    }
    case 3:
      flex = 0.33
      break
    case 4:
      flex = 0.25
      break
    case 5:
      flex = 0.2
      break
    case 6:
      flex = 0.1666
      break
    default:
      flex = 1 / tabs.length
  }
  if (tabs.includes('tree')) {
    children.push(
      <TreeContainer
        treeName="tree"
        flex={flex}
        data={data}
        nodes={nodes}
        activeNodes={activeNodes}
        activeNode={activeNode}
        client={client}
        key="tree"
      />
    )
    tabs.splice(tabs.indexOf('tree'), 1)
    if (tabs.length > 0) {
      children.push(<ReflexSplitter key="treeSplitter" />)
    }
  }
  if (tabs.includes('daten')) {
    children.push(
      <Daten
        tree={store.tree}
        treeName="tree"
        activeNode={activeNode}
        key="daten"
      />
    )
    tabs.splice(tabs.indexOf('daten'), 1)
    if (tabs.length > 0) {
      children.push(<ReflexSplitter key="treeDaten" />)
    }
  }
  if (tabs.includes('exporte')) {
    children.push(
      <Exporte key="exporte" />
    )
    tabs.splice(tabs.indexOf('exporte'), 1)
    if (tabs.length > 0) {
      children.push(<ReflexSplitter key="exporteSplitter" />)
    }
  }
  if (tabs.includes('tree2')) {
    children.push(
      <TreeContainer
        treeName="tree2"
        flex={flex}
        data={data}
        nodes={nodes}
        activeNodes={activeNodes}
        activeNode={activeNode}
        client={client}
        key="tree2"
      />
    )
    tabs.splice(tabs.indexOf('tree2'), 1)
    if (tabs.length > 0) {
      children.push(<ReflexSplitter key="tree2Splitter" />)
    }
  }
  if (tabs.includes('daten2')) {
    children.push(
      <Daten
        tree={store.tree2}
        treeName="tree2"
        activeNode={activeNode}
        key="daten2"
      />
    )
    tabs.splice(tabs.indexOf('daten2'), 1)
    if (tabs.length > 0) {
      children.push(<ReflexSplitter key="daten2Splitter" />)
    }
  }
  if (tabs.includes('karte')) {
    children.push(
      <ReflexElement
        key="karte"
        className="karte"
        style={{ overflow: 'hidden' }}
      >
        <KarteContainer>
          <Karte
            /**
             * key of tabs is added to force mounting
             * when tabs change
             * without remounting grey space remains
             * when daten or tree tab is removed :-(
             */
            key={tabs.toString()}
            popHighlighted={store.map.pop.highlightedIds.join()}
            tpopHighlighted={store.map.tpop.highlightedIds.join()}
            beobNichtBeurteiltHighlighted={store.map.beobNichtBeurteilt.highlightedIds.join()}
            beobNichtZuzuordnenHighlighted={store.map.beobNichtZuzuordnen.highlightedIds.join()}
            beobZugeordnetHighlighted={store.map.beobZugeordnet.highlightedIds.join()}
            beobZugeordnetAssigning={store.map.beob.assigning}
            idOfTpopBeingLocalized={store.map.tpop.idOfTpopBeingLocalized}
            activeBaseLayer={store.map.activeBaseLayer}
            activeOverlays={store.map.activeOverlays}
            activeApfloraLayers={store.map.activeApfloraLayers}
            // SortedStrings enforce rerendering when sorting or visibility changes
            activeOverlaysSortedString={store.map.activeOverlaysSortedString}
            activeApfloraLayersSortedString={
              store.map.activeApfloraLayersSortedString
            }
            detailplaene={toJS(store.map.detailplaene)}
            markierungen={toJS(store.map.markierungen)}
          />
        </KarteContainer>
      </ReflexElement>
    )
  }
  return children
}

const Projekte = ({
  store,
  treeName,
  tabs
}: {
  store: Object,
  treeName: String,
  tabs: Array<String>
}) =>
  <Query query={data1Gql} >
    {({ error, data: data1 }) => {
      if (error) return `Fehler: ${error.message}`
      const activeNodeArray = get(data1, `${treeName}.activeNodeArray`)
      const activeNodes = getActiveNodes(activeNodeArray, store)

      console.log('ProjektContainer rendering:', { treeName, tabs})

      return (
        <Query query={data2Gql} variables={variables(activeNodes)}>
          {({ loading, error, data: data2, client }) => {
            if (error) return `Fehler: ${error.message}`

            const data = merge(data1, data2)

            return (
              <Container data-loading={loading}>
                <ErrorBoundary>
                  <ReflexContainer orientation="vertical">
                    {myChildren({ store, data, treeName, tabs, client, activeNodes })}
                  </ReflexContainer>
                </ErrorBoundary>
              </Container>
            )
          }}
        </Query>
      )
    }}
  </Query>

export default enhance(Projekte)
