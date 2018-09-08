// @flow
import React from 'react'
import styled from 'styled-components'
import Loadable from 'react-loadable'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'

import ErrorBoundary from '../../shared/ErrorBoundarySingleChild'
import Loading from '../../shared/Loading'
import dataGql from './data.graphql'
import getTableNameFromActiveNode from '../../../modules/getTableNameFromActiveNode'
import withErrorState from '../../../state/withErrorState'
import withNodeFilterState from '../../../state/withNodeFilter'

const Projekt = Loadable({
  loader: () => import('./Projekt'),
  loading: Loading,
})
const Ap = Loadable({
  loader: () => import('./Ap'),
  loading: Loading,
})
const User = Loadable({
  loader: () => import('./User'),
  loading: Loading,
})
const Adresse = Loadable({
  loader: () => import('./Adresse'),
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
const Ekfzaehleinheit = Loadable({
  loader: () => import('./Ekfzaehleinheit'),
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
  overflow-x: auto;
  @media print {
    height: auto;
    border: none;
    overflow: hidden;
  }
`

const enhance = compose(
  withErrorState,
  withNodeFilterState,
)

const Daten = ({
  tree,
  treeName,
  activeNode,
  activeNodes,
  dimensions = { width: 380 },
  refetchTree,
  ktZh,
  setKtZh,
  role,
  errorState,
  nodeFilterState,
}: {
  tree: Object,
  treeName: String,
  activeNode: Object,
  activeNodes: Array<Object>,
  dimensions: Object,
  refetchTree: () => void,
  ktZh: Object,
  setKtZh: () => void,
  role: String,
  errorState: Object,
  nodeFilterState: Object,
}) => (
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      // do not show loading but rather last state
      if (error) return `Fehler: ${error.message}`

      const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
      const apId = get(data, `${treeName}.activeNodeArray[3]`)

      const formObject = {
        projekt: (
          <Projekt
            dimensions={dimensions}
            id={activeNodeArray[1]}
            treeName={treeName}
            refetchTree={refetchTree}
            activeNodeArray={activeNodeArray}
          />
        ),
        apberuebersicht: (
          <Apberuebersicht
            dimensions={dimensions}
            id={activeNodeArray[3]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        ap: (
          <Ap
            dimensions={dimensions}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        assozart: (
          <Assozart
            dimensions={dimensions}
            id={activeNodeArray[5]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        ekfzaehleinheit: (
          <Ekfzaehleinheit
            dimensions={dimensions}
            id={activeNodeArray[5]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        apart: (
          <Apart
            dimensions={dimensions}
            id={activeNodeArray[5]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        idealbiotop: (
          <Idealbiotop
            dimensions={dimensions}
            id={activeNodeArray[3]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        erfkrit: (
          <Erfkrit
            dimensions={dimensions}
            id={activeNodeArray[5]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        apber: (
          <Apber
            dimensions={dimensions}
            id={activeNodeArray[5]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        ber: (
          <Ber
            dimensions={dimensions}
            id={activeNodeArray[5]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        ziel: (
          <Ziel
            dimensions={dimensions}
            id={activeNodeArray[6]}
            tree={tree}
            refetchTree={refetchTree}
          />
        ),
        zielber: (
          <Zielber
            dimensions={dimensions}
            id={activeNodeArray[8]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        pop: (
          <Pop
            dimensions={dimensions}
            id={activeNodeArray[5]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        popmassnber: (
          <Popmassnber
            dimensions={dimensions}
            id={activeNodeArray[7]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        popber: (
          <Popber
            dimensions={dimensions}
            id={activeNodeArray[7]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        tpop: (
          <Tpop
            dimensions={dimensions}
            id={activeNodeArray[7]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        tpopber: (
          <Tpopber
            dimensions={dimensions}
            id={activeNodeArray[9]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        tpopmassn: (
          <Tpopmassn
            dimensions={dimensions}
            id={activeNodeArray[9]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        tpopmassnber: (
          <Tpopmassnber
            dimensions={dimensions}
            id={activeNodeArray[9]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        tpopfeldkontr: (
          <Tpopfeldkontr
            dimensions={dimensions}
            id={activeNodeArray[9]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        tpopfreiwkontr: (
          <Tpopfreiwkontr
            dimensions={dimensions}
            id={activeNodeArray[9]}
            activeNodeArray={activeNodeArray}
            refetchTree={refetchTree}
            errorState={errorState}
            role={role}
          />
        ),
        tpopkontrzaehl: (
          <Tpopkontrzaehl
            dimensions={dimensions}
            id={activeNodeArray[11]}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        exporte: (
          <Exporte
            tree={tree}
            dimensions={dimensions}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        qk: (
          <Qk
            tree={tree}
            treeName={treeName}
            apId={apId}
            activeNodes={activeNodes}
            refetchTree={refetchTree}
            errorState={errorState}
            ktZh={ktZh}
            setKtZh={setKtZh}
          />
        ),
        beobNichtZuzuordnen: (
          <Beobzuordnung
            dimensions={dimensions}
            id={activeNodeArray[activeNodeArray.length - 1]}
            tree={tree}
            refetchTree={refetchTree}
            type="nichtZuzuordnen"
          />
        ),
        beobNichtBeurteilt: (
          <Beobzuordnung
            dimensions={dimensions}
            id={activeNodeArray[activeNodeArray.length - 1]}
            tree={tree}
            refetchTree={refetchTree}
            type="nichtBeurteilt"
          />
        ),
        beobZugeordnet: (
          <Beobzuordnung
            dimensions={dimensions}
            id={activeNodeArray[activeNodeArray.length - 1]}
            tree={tree}
            refetchTree={refetchTree}
            type="zugeordnet"
          />
        ),
        user: (
          <User
            dimensions={dimensions}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
        adresse: (
          <Adresse
            dimensions={dimensions}
            treeName={treeName}
            refetchTree={refetchTree}
          />
        ),
      }
      let key
      if (activeNodeArray.length > 2 && activeNodeArray[2] === 'Exporte') {
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
      let form
      if (nodeFilterState.state[treeName].activeTable) {
        form = formObject[nodeFilterState.state[treeName].activeTable]
      } else {
        form = key ? formObject[key] : ''
      }

      return (
        <ErrorBoundary>
          <Container>{form}</Container>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default enhance(Daten)
