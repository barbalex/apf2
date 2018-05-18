// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import Loadable from 'react-loadable'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import clone from 'lodash/clone'

// when Karte was loaded async, it did not load,
// but only in production!
import Karte from './Karte'
import Loading from '../shared/Loading'
import ErrorBoundary from '../shared/ErrorBoundary'
import dataGql from './data.graphql'

const TreeContainer = Loadable({
  loader: () => import('./TreeContainer'),
  loading: Loading,
})
const Daten = Loadable({
  loader: () => import('./Daten'),
  loading: Loading,
})
const Exporte = Loadable({
  loader: () => import('./Exporte'),
  loading: Loading,
})

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 49.3px);
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
const ExporteContainer = styled.div`
  border-left-color: rgb(46, 125, 50);
  border-left-width: 1px;
  border-left-style: solid;
  border-right-color: rgb(46, 125, 50);
  border-right-width: 1px;
  border-right-style: solid;
  height: 100%;
`

const enhance = compose(inject('store'), observer)

// TODO
// get this to work again
const myChildren = (store: Object, data: Object) => {
  const projekteTabs = clone(get(data, 'urlQuery.projekteTabs'))
  console.log('Projekte:', {projekteTabs, pTOriginal: get(data, 'urlQuery.projekteTabs')})
  // if daten and exporte are shown, only show exporte
  if (projekteTabs.includes('daten') && projekteTabs.includes('exporte')) {
    const i = projekteTabs.indexOf('daten')
    projekteTabs.splice(i, 1)
  }

  const children = []
  let flex
  switch (projekteTabs.length) {
    case 0:
      flex = 1
      break
    case 2: {
      if (projekteTabs.includes('tree') && projekteTabs.includes('tree2')) {
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
      flex = 1 / projekteTabs.length
  }
  if (projekteTabs.includes('tree')) {
    children.push(
      <ReflexElement flex={flex} key="tree">
        <TreeContainer tree={store.tree} />
      </ReflexElement>
    )
    projekteTabs.splice(projekteTabs.indexOf('tree'), 1)
    if (projekteTabs.length > 0) {
      children.push(<ReflexSplitter key="treeSplitter" />)
    }
  }
  if (projekteTabs.includes('daten')) {
    children.push(
      <ReflexElement
        key="daten"
        propagateDimensions={true}
        renderOnResizeRate={100}
        renderOnResize={true}
      >
        <Daten tree={store.tree} />
      </ReflexElement>
    )
    projekteTabs.splice(projekteTabs.indexOf('daten'), 1)
    if (projekteTabs.length > 0) {
      children.push(<ReflexSplitter key="treeDaten" />)
    }
  }
  if (projekteTabs.includes('exporte')) {
    children.push(
      <ReflexElement key="exporte">
        <ExporteContainer>
          <Exporte />
        </ExporteContainer>
      </ReflexElement>
    )
    projekteTabs.splice(projekteTabs.indexOf('exporte'), 1)
    if (projekteTabs.length > 0) {
      children.push(<ReflexSplitter key="exporteSplitter" />)
    }
  }
  if (projekteTabs.includes('tree2')) {
    children.push(
      <ReflexElement flex={flex} key="tree2">
        <TreeContainer tree={store.tree2} />
      </ReflexElement>
    )
    projekteTabs.splice(projekteTabs.indexOf('tree2'), 1)
    if (projekteTabs.length > 0) {
      children.push(<ReflexSplitter key="tree2Splitter" />)
    }
  }
  if (projekteTabs.includes('daten2')) {
    children.push(
      <ReflexElement key="daten2">
        <Daten tree={store.tree2} />
      </ReflexElement>
    )
    projekteTabs.splice(projekteTabs.indexOf('daten2'), 1)
    if (projekteTabs.length > 0) {
      children.push(<ReflexSplitter key="daten2Splitter" />)
    }
  }
  if (projekteTabs.includes('karte')) {
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
            key={projekteTabs.toString()}
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

const Projekte = ({ store }: { store: Object }) =>
  <Query query={dataGql} >
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`

      return (
        <Container data-loading={store.loading.length > 0}>
          <ErrorBoundary>
            <ReflexContainer orientation="vertical">
              {myChildren(store, data)}
            </ReflexContainer>
          </ErrorBoundary>
        </Container>
      )
    }}
  </Query>

export default enhance(Projekte)
