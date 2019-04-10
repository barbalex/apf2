// @flow
import React, { lazy, Suspense, useContext, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import get from 'lodash/get'

import Fallback from '../../shared/Fallback'
import getTableNameFromActiveNode from '../../../modules/getTableNameFromActiveNode'
import mobxStoreContext from '../../../mobxStoreContext'

const User = lazy(() => import('./User'))
const Pop = lazy(() => import('./Pop'))
const Idealbiotop = lazy(() => import('./Idealbiotop'))
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

const Container = styled.div`
  height: 100%;
  width: 100%;
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

  const fOKey = activeTable ? activeTable : key ? key : ''
  console.log('Daten', { fOKey })
  let form
  switch (fOKey) {
    case 'adresse': {
      const Adresse = lazy(() => import('./Adresse'))
      form = <Adresse treeName={treeName} />
      break
    }
    case 'ap': {
      const Ap = lazy(() => import('./Ap'))
      form = <Ap treeName={treeName} />
      break
    }
    case 'apberuebersicht': {
      const Apberuebersicht = lazy(() => import('./Apberuebersicht'))
      form = <Apberuebersicht treeName={treeName} />
      break
    }
    case 'apart': {
      const Apart = lazy(() => import('./Apart'))
      form = <Apart treeName={treeName} />
      break
    }
    case 'apber': {
      const Apber = lazy(() => import('./Apber'))
      form = <Apber dimensions={dimensions} treeName={treeName} />
      break
    }
    case 'assozart': {
      const Assozart = lazy(() => import('./Assozart'))
      form = <Assozart treeName={treeName} />
      break
    }
    case 'beobNichtBeurteilt': {
      const Beobzuordnung = lazy(() => import('./Beobzuordnung'))
      form = (
        <Beobzuordnung
          dimensions={dimensions}
          treeName={treeName}
          type="nichtBeurteilt"
        />
      )
      break
    }
    case 'beobNichtZuzuordnen': {
      const Beobzuordnung = lazy(() => import('./Beobzuordnung'))
      form = (
        <Beobzuordnung
          dimensions={dimensions}
          treeName={treeName}
          type="nichtZuzuordnen"
        />
      )
      break
    }
    case 'beobZugeordnet': {
      const Beobzuordnung = lazy(() => import('./Beobzuordnung'))
      form = (
        <Beobzuordnung
          dimensions={dimensions}
          treeName={treeName}
          type="zugeordnet"
        />
      )
      break
    }
    case 'ber': {
      const Ber = lazy(() => import('./Ber'))
      form = <Ber treeName={treeName} />
      break
    }
    case 'currentIssue': {
      const CurrentIssue = lazy(() => import('./CurrentIssue'))
      form = <CurrentIssue treeName={treeName} />
      break
    }
    case 'ekfzaehleinheit': {
      const Ekfzaehleinheit = lazy(() => import('./Ekfzaehleinheit'))
      form = <Ekfzaehleinheit treeName={treeName} />
      break
    }
    case 'erfkrit': {
      const Erfkrit = lazy(() => import('./Erfkrit'))
      form = <Erfkrit treeName={treeName} />
      break
    }
    case 'projekt': {
      const Projekt = lazy(() => import('./Projekt'))
      form = <Projekt treeName={treeName} />
      break
    }
    default:
      form = null
  }
  const formObject = {
    idealbiotop: <Idealbiotop dimensions={dimensions} treeName={treeName} />,
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
    user: <User treeName={treeName} />,
  }

  console.log('Daten', {
    dimensions,
    treeName,
    activeNodeArray: activeNodeArray.slice(),
    activeNodeId: activeNode ? activeNode.id : null,
    activeTable,
  })

  if (!key) return null

  return (
    <Container data-id={`daten-container${treeName === 'tree' ? 1 : 2}`}>
      <Suspense fallback={<Fallback />}>{form}</Suspense>
    </Container>
  )
}

export default observer(Daten)
