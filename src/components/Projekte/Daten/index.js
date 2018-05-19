// @flow
/*
 *
 * Daten
 *
 */

import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import Loadable from 'react-loadable'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import ErrorBoundary from '../../shared/ErrorBoundarySingleChild'
import Loading from '../../shared/Loading'
import dataGql from './data.graphql'
import getActiveNodes from '../../../modules/getActiveNodes'

const Projekt = Loadable({
  loader: () => import('./Projekt'),
  loading: Loading,
})
const Ap = Loadable({
  loader: () => import('./Ap'),
  loading: Loading,
})
const Apberuebersicht = Loadable({
  loader: () => import('./Apberuebersicht'),
  loading: Loading,
})
const Erfkrit = Loadable({
  loader: () => import('./Erfkrit'),
  loading: Loading,
})
const Apber = Loadable({
  loader: () => import('./Apber'),
  loading: Loading,
})
const Pop = Loadable({
  loader: () => import('./Pop'),
  loading: Loading,
})
const Assozart = Loadable({
  loader: () => import('./Assozart'),
  loading: Loading,
})
const Apart = Loadable({
  loader: () => import('./Apart'),
  loading: Loading,
})
const Idealbiotop = Loadable({
  loader: () => import('./Idealbiotop'),
  loading: Loading,
})
const Ber = Loadable({
  loader: () => import('./Ber'),
  loading: Loading,
})
const Ziel = Loadable({
  loader: () => import('./Ziel'),
  loading: Loading,
})
const Zielber = Loadable({
  loader: () => import('./Zielber'),
  loading: Loading,
})
const Popmassnber = Loadable({
  loader: () => import('./Popmassnber'),
  loading: Loading,
})
const Popber = Loadable({
  loader: () => import('./Popber'),
  loading: Loading,
})
const Tpop = Loadable({
  loader: () => import('./Tpop'),
  loading: Loading,
})
const Tpopber = Loadable({
  loader: () => import('./Tpopber'),
  loading: Loading,
})
const Tpopmassn = Loadable({
  loader: () => import('./Tpopmassn'),
  loading: Loading,
})
const Tpopmassnber = Loadable({
  loader: () => import('./Tpopmassnber'),
  loading: Loading,
})
const Tpopfeldkontr = Loadable({
  loader: () => import('./Tpopfeldkontr'),
  loading: Loading,
})
const Tpopfreiwkontr = Loadable({
  loader: () => import('./Tpopfreiwkontr'),
  loading: Loading,
})
const Tpopkontrzaehl = Loadable({
  loader: () => import('./Tpopkontrzaehl'),
  loading: Loading,
})
const Exporte = Loadable({
  loader: () => import('../Exporte'),
  loading: Loading,
})
const Qk = Loadable({
  loader: () => import('./Qk'),
  loading: Loading,
})
const Beobzuordnung = Loadable({
  loader: () => import('./Beobzuordnung'),
  loading: Loading,
})

const Container = styled.div`
  border-left-color: rgb(46, 125, 50);
  border-left-width: 1px;
  border-left-style: solid;
  border-right-color: rgb(46, 125, 50);
  border-right-width: 1px;
  border-right-style: solid;
  height: 100%;
  @media print {
    display: none !important;
  }
`

const enhance = compose(inject('store'), observer)

const Daten = ({
  store,
  tree,
  treeName,
  dimensions = { width: 380 },
}: {
  store: Object,
  tree: Object,
  treeName: String,
  dimensions: Object,
}) => {

  return (
    <Query query={dataGql} >
      {({ loading, error, data }) => {
        // do not show loading but rather last state
        //if (loading) return <Container>Lade...</Container>
        if (error) return `Fehler: ${error.message}`

        const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
        //console.log('Daten:', {activeNodeArray, treeName, data})
        const activeNodes = getActiveNodes(activeNodeArray, store)

        const { activeDataset } = tree
        if (!activeDataset || !activeDataset.table || !activeDataset.row) {
          return <div />
        }
        /**
         * For the time-being pass id from here
         * When store is moved to apollo:
         * Fetch id directly in components
         */
        const formObject = {
          projekt: <Projekt dimensions={dimensions} treeName={treeName} />,
          apberuebersicht: <Apberuebersicht dimensions={dimensions} treeName={treeName} />,
          ap: <Ap dimensions={dimensions} treeName={treeName} />,
          assozart: <Assozart dimensions={dimensions} treeName={treeName} />,
          apart: <Apart dimensions={dimensions} treeName={treeName} />,
          idealbiotop: <Idealbiotop dimensions={dimensions} treeName={treeName} />,
          erfkrit: <Erfkrit dimensions={dimensions} treeName={treeName} />,
          apber: <Apber dimensions={dimensions} treeName={treeName} />,
          ber: <Ber dimensions={dimensions} treeName={treeName} />,
          ziel: <Ziel dimensions={dimensions} treeName={treeName} />,
          zielber: <Zielber dimensions={dimensions} treeName={treeName} />,
          pop: <Pop dimensions={dimensions} treeName={treeName} />,
          popmassnber: <Popmassnber dimensions={dimensions} treeName={treeName} />,
          popber: <Popber dimensions={dimensions} treeName={treeName} />,
          tpop: <Tpop dimensions={dimensions} treeName={treeName} />,
          tpopber: <Tpopber dimensions={dimensions} treeName={treeName} />,
          tpopmassn: <Tpopmassn dimensions={dimensions} treeName={treeName} />,
          tpopmassnber: <Tpopmassnber dimensions={dimensions} treeName={treeName} />,
          tpopfeldkontr: <Tpopfeldkontr dimensions={dimensions} treeName={treeName} />,
          tpopfreiwkontr: <Tpopfreiwkontr dimensions={dimensions} treeName={treeName} />,
          tpopkontrzaehl: <Tpopkontrzaehl dimensions={dimensions} treeName={treeName} />,
          exporte: <Exporte tree={tree} dimensions={dimensions} treeName={treeName} />,
          qk: <Qk tree={tree} treeName={treeName} />,
          beobNichtZuzuordnen: <Beobzuordnung dimensions={dimensions} treeName={treeName} />,
          beobzuordnung: <Beobzuordnung dimensions={dimensions} treeName={treeName} />,
          beobZugeordnet: <Beobzuordnung dimensions={dimensions} treeName={treeName} />,
        }
        const standardForm = (
          <div>
            <p>Daten</p>
            <pre>{JSON.stringify(activeDataset.row, null, 2)}</pre>
          </div>
        )
        let key
        if (activeNodes.exporte) {
          key = 'exporte'
        } else if (activeNodes.qk) {
          key = 'qk'
        } else if (activeNodes.beobNichtZuzuordnen) {
          key = 'beobNichtZuzuordnen'
        } else if (activeNodes.beobzuordnung) {
          key = 'beobzuordnung'
        } else if (activeNodes.beobZugeordnet) {
          key = 'beobZugeordnet'
        } else {
          key = activeDataset.table
        }
        const form = formObject[key] || standardForm

        return (
          <ErrorBoundary>
            <Container>{form}</Container>
          </ErrorBoundary>
        )
      }}
    </Query>
  )
}

export default enhance(Daten)
