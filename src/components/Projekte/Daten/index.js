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
import tables from '../../../modules/tables'

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
  activeNode,
  dimensions = { width: 380 },
}: {
  store: Object,
  tree: Object,
  treeName: String,
  activeNode: Object,
  dimensions: Object,
}) =>
  <Query query={dataGql} >
    {({ loading, error, data, client }) => {
      // do not show loading but rather last state
      //if (loading) return <Container>Lade...</Container>
      if (error) return `Fehler: ${error.message}`

      const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
      const apId = get(data, `${treeName}.activeNodeArray[3]`)

      // get name of active table
      let tableName = null
      if (activeNode) {
        if (activeNode.nodeType === 'table') {
          tableName = activeNode.menuType
          // need to convert feldkontrzaehl and freiwkontrzaehl to kontrzaehl
          if (['tpopfreiwkontrzaehl', 'tpopfeldkontrzaehl'].includes(tableName)) {
            tableName = 'tpopkontrzaehl'
          }
        } else {
          const childTableName = activeNode.menuType.replace('Folder', '')
          const childTable = tables.find(t => t.table === childTableName)
          if (childTable && childTable.parentTable) {
            tableName = childTable.parentTable
          }
          if (childTableName === 'idealbiotop') {
            tableName = childTableName
          }
        }
      }
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
        qk: <Qk tree={tree} treeName={treeName} apId={apId} />,
        beobNichtZuzuordnen: <Beobzuordnung dimensions={dimensions} treeName={treeName} />,
        beobNichtBeurteilt: <Beobzuordnung dimensions={dimensions} treeName={treeName} />,
        beobZugeordnet: <Beobzuordnung dimensions={dimensions} treeName={treeName} />,
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
        key = tableName
      }
      const form = key ? formObject[key] : ''

      return (
        <ErrorBoundary>
          <Container>{form}</Container>
        </ErrorBoundary>
      )
    }}
  </Query>

export default enhance(Daten)
