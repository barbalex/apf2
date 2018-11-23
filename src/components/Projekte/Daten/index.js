// @flow
import React, { lazy, Suspense, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../shared/ErrorBoundarySingleChild'
import Fallback from '../../shared/Fallback'
import getTableNameFromActiveNode from '../../../modules/getTableNameFromActiveNode'
import mobxStoreContext from '../../../mobxStoreContext'

const Projekt = lazy(() => import('./Projekt'))
const Ap = lazy(() => import('./Ap'))
const User = lazy(() => import('./User'))
const Adresse = lazy(() => import('./Adresse'))
const Apberuebersicht = lazy(() => import('./Apberuebersicht'))
const Erfkrit = lazy(() => import('./Erfkrit'))
const Apber = lazy(() => import('./Apber'))
const Pop = lazy(() => import('./Pop'))
const Assozart = lazy(() => import('./Assozart'))
const Ekfzaehleinheit = lazy(() => import('./Ekfzaehleinheit'))
const Apart = lazy(() => import('./Apart'))
const Idealbiotop = lazy(() => import('./Idealbiotop'))
const Ber = lazy(() => import('./Ber'))
const Ziel = lazy(() => import('./Ziel'))
const Zielber = lazy(() => import('./Zielber'))
const Popmassnber = lazy(() => import('./Popmassnber'))
const Popber = lazy(() => import('./Popber'))
const Tpop = lazy(() => import('./Tpop'))
const Tpopber = lazy(() => import('./Tpopber'))
const Tpopmassn = lazy(() => import('./Tpopmassn'))
const Tpopmassnber = lazy(() => import('./Tpopmassnber'))
const Tpopfeldkontr = lazy(() => import('./Tpopfeldkontr'))
const Tpopfreiwkontr = lazy(() => import('./Tpopfreiwkontr'))
const Tpopkontrzaehl = lazy(() => import('./Tpopkontrzaehl'))
const Exporte = lazy(() => import('../Exporte'))
const Qk = lazy(() => import('./Qk'))
const Beobzuordnung = lazy(() => import('./Beobzuordnung'))

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

const enhance = compose(observer)

const Daten = ({
  treeName,
  activeNode,
  activeNodes,
  dimensions = { width: 380 },
  refetchTree,
  role,
}: {
  treeName: String,
  activeNode: Object,
  activeNodes: Array<Object>,
  dimensions: Object,
  refetchTree: () => void,
  role: String,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { nodeFilter } = mobxStore
  const tree = mobxStore[treeName]
  const { activeNodeArray } = tree

  const formObject = {
    projekt: (
      <Projekt
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    apberuebersicht: (
      <Apberuebersicht
        dimensions={dimensions}
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
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    ekfzaehleinheit: (
      <Ekfzaehleinheit
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    apart: (
      <Apart
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    idealbiotop: (
      <Idealbiotop
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    erfkrit: (
      <Erfkrit
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    apber: (
      <Apber
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    ber: (
      <Ber
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    ziel: (
      <Ziel
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    zielber: (
      <Zielber
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    pop: (
      <Pop
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    popmassnber: (
      <Popmassnber
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    popber: (
      <Popber
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    tpop: (
      <Tpop
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    tpopber: (
      <Tpopber
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    tpopmassn: (
      <Tpopmassn
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    tpopmassnber: (
      <Tpopmassnber
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    tpopfeldkontr: (
      <Tpopfeldkontr
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    tpopfreiwkontr: (
      <Tpopfreiwkontr
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
        role={role}
      />
    ),
    tpopkontrzaehl: (
      <Tpopkontrzaehl
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
      />
    ),
    exporte: <Exporte />,
    qk: (
      <Qk
        treeName={treeName}
        activeNodes={activeNodes}
        refetchTree={refetchTree}
      />
    ),
    beobNichtZuzuordnen: (
      <Beobzuordnung
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
        type="nichtZuzuordnen"
      />
    ),
    beobNichtBeurteilt: (
      <Beobzuordnung
        dimensions={dimensions}
        treeName={treeName}
        refetchTree={refetchTree}
        type="nichtBeurteilt"
      />
    ),
    beobZugeordnet: (
      <Beobzuordnung
        dimensions={dimensions}
        treeName={treeName}
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
  if (nodeFilter[treeName].activeTable) {
    form = formObject[nodeFilter[treeName].activeTable]
  } else {
    form = key ? formObject[key] : ''
  }
  if (!key) return null

  return (
    <ErrorBoundary>
      <Container>
        <Suspense fallback={<Fallback />}>{form}</Suspense>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Daten)
