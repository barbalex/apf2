// @flow
import React, { lazy, Suspense } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'

import ErrorBoundary from '../../shared/ErrorBoundarySingleChild'
import Fallback from '../../shared/Fallback'
import withLocalData from './withLocalData'
import getTableNameFromActiveNode from '../../../modules/getTableNameFromActiveNode'
import withNodeFilterState from '../../../state/withNodeFilter'

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

const enhance = compose(
  withLocalData,
  withNodeFilterState,
)

const Daten = ({
  tree,
  treeName,
  activeNode,
  activeNodes,
  dimensions = { width: 380 },
  refetchTree,
  role,
  nodeFilterState,
  localData,
}: {
  tree: Object,
  treeName: String,
  activeNode: Object,
  activeNodes: Array<Object>,
  dimensions: Object,
  refetchTree: () => void,
  role: String,
  nodeFilterState: Object,
  localData: Object,
}) => {
  // do not show loading but rather last state
  if (localData.error) return `Fehler: ${localData.error.message}`

  const activeNodeArray = get(localData, `${treeName}.activeNodeArray`)
  const apId = get(localData, `${treeName}.activeNodeArray[3]`)

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
        treeName={treeName}
        refetchTree={refetchTree}
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
      />
    ),
    beobNichtZuzuordnen: (
      <Beobzuordnung
        dimensions={dimensions}
        id={activeNodeArray[activeNodeArray.length - 1]}
        tree={tree}
        refetchTree={refetchTree}
        type="nichtZuzuordnen"
        apId={apId}
      />
    ),
    beobNichtBeurteilt: (
      <Beobzuordnung
        dimensions={dimensions}
        id={activeNodeArray[activeNodeArray.length - 1]}
        tree={tree}
        refetchTree={refetchTree}
        type="nichtBeurteilt"
        apId={apId}
      />
    ),
    beobZugeordnet: (
      <Beobzuordnung
        dimensions={dimensions}
        id={activeNodeArray[activeNodeArray.length - 1]}
        tree={tree}
        refetchTree={refetchTree}
        type="zugeordnet"
        apId={apId}
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
