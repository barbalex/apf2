// @flow
/*
 *
 * Daten
 *
 */

import React from 'react'
import styled from 'styled-components'
import Loadable from 'react-loadable'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import ErrorBoundary from '../../shared/ErrorBoundarySingleChild'
import Loading from '../../shared/Loading'
import dataGql from './data.graphql'
import getTableNameFromActiveNode from '../../../modules/getTableNameFromActiveNode'

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

const Daten = ({
  tree,
  treeName,
  activeNode,
  activeNodes,
  dimensions = { width: 380 },
  refetchTree
}: {
  tree: Object,
  treeName: String,
  activeNode: Object,
  activeNodes: Array<Object>,
  dimensions: Object,
  refetchTree: () => void
}) =>
  <Query query={dataGql} >
    {({ loading, error, data, client }) => {
      // do not show loading but rather last state
      //if (loading) return <Container>Lade...</Container>
      if (error) return `Fehler: ${error.message}`

      const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
      const apId = get(data, `${treeName}.activeNodeArray[3]`)

      const formObject = {
        projekt: <Projekt dimensions={dimensions} id={activeNodeArray[1]} refetchTree={refetchTree} />,
        apberuebersicht: <Apberuebersicht dimensions={dimensions} id={activeNodeArray[3]} refetchTree={refetchTree} />,
        ap: <Ap dimensions={dimensions} treeName={treeName} refetchTree={refetchTree} />,
        assozart: <Assozart dimensions={dimensions} id={activeNodeArray[5]} refetchTree={refetchTree} />,
        apart: <Apart dimensions={dimensions} id={activeNodeArray[5]} refetchTree={refetchTree} />,
        idealbiotop: <Idealbiotop dimensions={dimensions} id={activeNodeArray[3]} refetchTree={refetchTree} />,
        erfkrit: <Erfkrit dimensions={dimensions} id={activeNodeArray[5]} refetchTree={refetchTree} />,
        apber: <Apber dimensions={dimensions} id={activeNodeArray[5]} refetchTree={refetchTree} />,
        ber: <Ber dimensions={dimensions} id={activeNodeArray[5]} refetchTree={refetchTree} />,
        ziel: <Ziel dimensions={dimensions} id={activeNodeArray[6]} tree={tree} refetchTree={refetchTree} />,
        zielber: <Zielber dimensions={dimensions} id={activeNodeArray[8]} refetchTree={refetchTree} />,
        pop: <Pop dimensions={dimensions} id={activeNodeArray[5]} refetchTree={refetchTree} />,
        popmassnber: <Popmassnber dimensions={dimensions} id={activeNodeArray[7]} refetchTree={refetchTree} />,
        popber: <Popber dimensions={dimensions} id={activeNodeArray[7]} refetchTree={refetchTree} />,
        tpop: <Tpop dimensions={dimensions} id={activeNodeArray[7]} refetchTree={refetchTree} />,
        tpopber: <Tpopber dimensions={dimensions} id={activeNodeArray[9]} refetchTree={refetchTree} />,
        tpopmassn: <Tpopmassn dimensions={dimensions} id={activeNodeArray[9]} refetchTree={refetchTree} />,
        tpopmassnber: <Tpopmassnber dimensions={dimensions} id={activeNodeArray[9]} refetchTree={refetchTree} />,
        tpopfeldkontr: <Tpopfeldkontr dimensions={dimensions} id={activeNodeArray[9]} refetchTree={refetchTree} />,
        tpopfreiwkontr: <Tpopfreiwkontr dimensions={dimensions} id={activeNodeArray[9]} refetchTree={refetchTree} />,
        tpopkontrzaehl: <Tpopkontrzaehl dimensions={dimensions} id={activeNodeArray[11]} refetchTree={refetchTree} />,
        exporte: <Exporte tree={tree} dimensions={dimensions} treeName={treeName} refetchTree={refetchTree} />,
        qk: <Qk tree={tree} treeName={treeName} apId={apId} activeNodes={activeNodes} refetchTree={refetchTree} />,
        beobNichtZuzuordnen: <Beobzuordnung dimensions={dimensions} id={activeNodeArray[activeNodeArray.length -1]} tree={tree} refetchTree={refetchTree} type="nichtZuzuordnen" />,
        beobNichtBeurteilt: <Beobzuordnung dimensions={dimensions} id={activeNodeArray[activeNodeArray.length -1]} tree={tree} refetchTree={refetchTree} type="nichtBeurteilt" />,
        beobZugeordnet: <Beobzuordnung dimensions={dimensions} id={activeNodeArray[activeNodeArray.length -1]} tree={tree} refetchTree={refetchTree} type="zugeordnet" />,
      }
      let key
      if (
        activeNodeArray.length > 2 &&
        activeNodeArray[2] === 'Exporte'
      ) {
        key = 'exporte'
      } else if (
        activeNodeArray.length > 4 &&
        activeNodeArray[4] === 'Qualitaetskontrollen'
      ) {
        key = 'qk'
      } else if (
        activeNodeArray.length > 5 &&
        activeNodeArray[4] === 'nicht-zuzuordnende-Beobachtungen'
      ) {
        key = 'beobNichtZuzuordnen'
      } else if (
        activeNodeArray.length > 5 &&
        activeNodeArray[4] === 'nicht-beurteilte-Beobachtungen'
      ) {
        key = 'beobNichtBeurteilt'
      } else if (
        activeNodeArray.length > 9 &&
        activeNodeArray[6] === 'Teil-Populationen' &&
        activeNodeArray[8] === 'Beobachtungen'
      ) {
        key = 'beobZugeordnet'
      } else {
        key = getTableNameFromActiveNode(activeNode)
      }
      const form = key ? formObject[key] : ''

      return (
        <ErrorBoundary>
          <Container>{form}</Container>
        </ErrorBoundary>
      )
    }}
  </Query>

export default Daten
