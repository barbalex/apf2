// @flow
import React, { lazy, Suspense, useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import get from 'lodash/get'

import Fallback from '../../shared/Fallback'
import getTableNameFromActiveNode from '../../../modules/getTableNameFromActiveNode'
import mobxStoreContext from '../../../mobxStoreContext'

const Projekt = lazy(() => import('./Projekt'))
const Ap = lazy(() => import('./Ap'))
const User = lazy(() => import('./User'))
const CurrentIssue = lazy(() => import('./CurrentIssue'))
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
  height: 100%;
  overflow-x: auto;
  @media print {
    height: auto;
    border: none;
    overflow: hidden;
  }
`

const Daten = ({
  treeName,
  dimensions = { width: 380 },
}: {
  treeName: String,
  dimensions: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { activeNodeArray, activeNode } = mobxStore[treeName]
  const activeTable = get(mobxStore, `nodeFilter.${treeName}.activeTable`, '')

  const formObject = {
    projekt: <Projekt treeName={treeName} />,
    apberuebersicht: <Apberuebersicht treeName={treeName} />,
    ap: <Ap treeName={treeName} />,
    assozart: <Assozart treeName={treeName} />,
    ekfzaehleinheit: <Ekfzaehleinheit treeName={treeName} />,
    apart: <Apart treeName={treeName} />,
    idealbiotop: <Idealbiotop dimensions={dimensions} treeName={treeName} />,
    erfkrit: <Erfkrit treeName={treeName} />,
    apber: <Apber dimensions={dimensions} treeName={treeName} />,
    ber: <Ber treeName={treeName} />,
    ziel: <Ziel dimensions={dimensions} treeName={treeName} />,
    zielber: <Zielber dimensions={dimensions} treeName={treeName} />,
    pop: <Pop dimensions={dimensions} treeName={treeName} />,
    popmassnber: <Popmassnber dimensions={dimensions} treeName={treeName} />,
    popber: <Popber treeName={treeName} />,
    tpop: <Tpop dimensions={dimensions} treeName={treeName} />,
    tpopber: <Tpopber treeName={treeName} />,
    tpopmassn: <Tpopmassn dimensions={dimensions} treeName={treeName} />,
    tpopmassnber: <Tpopmassnber treeName={treeName} />,
    tpopfeldkontr: (
      <Tpopfeldkontr dimensions={dimensions} treeName={treeName} />
    ),
    tpopfreiwkontr: (
      <Tpopfreiwkontr dimensions={dimensions} treeName={treeName} />
    ),
    tpopkontrzaehl: <Tpopkontrzaehl treeName={treeName} />,
    exporte: <Exporte />,
    qk: <Qk treeName={treeName} />,
    beobNichtZuzuordnen: (
      <Beobzuordnung
        dimensions={dimensions}
        treeName={treeName}
        type="nichtZuzuordnen"
      />
    ),
    beobNichtBeurteilt: (
      <Beobzuordnung
        dimensions={dimensions}
        treeName={treeName}
        type="nichtBeurteilt"
      />
    ),
    beobZugeordnet: (
      <Beobzuordnung
        dimensions={dimensions}
        treeName={treeName}
        type="zugeordnet"
      />
    ),
    user: <User treeName={treeName} />,
    currentIssue: <CurrentIssue treeName={treeName} />,
    adresse: <Adresse treeName={treeName} />,
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
  if (activeTable) {
    form = formObject[activeTable]
  } else {
    form = key ? formObject[key] : ''
  }

  if (!key) return null

  return (
    <Container data-id={`daten-container${treeName === 'tree' ? 1 : 2}`}>
      <Suspense fallback={<Fallback />}>{form}</Suspense>
    </Container>
  )
}

export default observer(Daten)
