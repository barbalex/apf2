// @flow
import React, { lazy, Suspense, useContext, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import get from 'lodash/get'

import Fallback from '../../shared/Fallback'
import getTableNameFromActiveNode from '../../../modules/getTableNameFromActiveNode'
import mobxStoreContext from '../../../mobxStoreContext'

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

  const key = useMemo(() => {
    if (activeNodeArray.length > 2 && activeNodeArray[2] === 'Exporte') {
      return 'exporte'
    } else if (
      activeNodeArray.length > 4 &&
      activeNodeArray[4] === 'Qualitaetskontrollen'
    ) {
      return 'qk'
    } else if (
      activeNodeArray.length > 5 &&
      activeNodeArray[4] === 'nicht-zuzuordnende-Beobachtungen'
    ) {
      return 'beobNichtZuzuordnen'
    } else if (
      activeNodeArray.length > 5 &&
      activeNodeArray[4] === 'nicht-beurteilte-Beobachtungen'
    ) {
      return 'beobNichtBeurteilt'
    } else if (
      activeNodeArray.length > 9 &&
      activeNodeArray[6] === 'Teil-Populationen' &&
      activeNodeArray[8] === 'Beobachtungen'
    ) {
      return 'beobZugeordnet'
    }
    return getTableNameFromActiveNode(activeNode)
  }, [activeNodeArray, activeNode])

  const fOKey = activeTable || key
  const form = useMemo(() => {
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
      case 'exporte': {
        const Exporte = lazy(() => import('../Exporte'))
        form = <Exporte />
        break
      }
      case 'idealbiotop': {
        const Idealbiotop = lazy(() => import('./Idealbiotop'))
        form = <Idealbiotop dimensions={dimensions} treeName={treeName} />
        break
      }
      case 'pop': {
        const Pop = lazy(() => import('./Pop'))
        form = <Pop dimensions={dimensions} treeName={treeName} />
        break
      }
      case 'popber': {
        const Popber = lazy(() => import('./Popber'))
        form = <Popber treeName={treeName} />
        break
      }
      case 'popmassnber': {
        const Popmassnber = lazy(() => import('./Popmassnber'))
        form = <Popmassnber dimensions={dimensions} treeName={treeName} />
        break
      }
      case 'projekt': {
        const Projekt = lazy(() => import('./Projekt'))
        form = <Projekt treeName={treeName} />
        break
      }
      case 'qk': {
        const Qk = lazy(() => import('./Qk'))
        form = <Qk treeName={treeName} />
        break
      }
      case 'tpop': {
        const Tpop = lazy(() => import('./Tpop'))
        form = <Tpop dimensions={dimensions} treeName={treeName} />
        break
      }
      case 'tpopber': {
        const Tpopber = lazy(() => import('./Tpopber'))
        form = <Tpopber treeName={treeName} />
        break
      }
      case 'tpopfeldkontr': {
        const Tpopfeldkontr = lazy(() => import('./Tpopfeldkontr'))
        form = <Tpopfeldkontr dimensions={dimensions} treeName={treeName} />
        break
      }
      case 'tpopfreiwkontr': {
        const Tpopfreiwkontr = lazy(() => import('./Tpopfreiwkontr'))
        form = <Tpopfreiwkontr dimensions={dimensions} treeName={treeName} />
        break
      }
      case 'tpopkontrzaehl': {
        const Tpopkontrzaehl = lazy(() => import('./Tpopkontrzaehl'))
        form = <Tpopkontrzaehl treeName={treeName} />
        break
      }
      case 'tpopmassn': {
        const Tpopmassn = lazy(() => import('./Tpopmassn'))
        form = <Tpopmassn dimensions={dimensions} treeName={treeName} />
        break
      }
      case 'tpopmassnber': {
        const Tpopmassnber = lazy(() => import('./Tpopmassnber'))
        form = <Tpopmassnber treeName={treeName} />
        break
      }
      case 'user': {
        const User = lazy(() => import('./User'))
        form = <User treeName={treeName} />
        break
      }
      case 'ziel': {
        const Ziel = lazy(() => import('./Ziel'))
        form = <Ziel dimensions={dimensions} treeName={treeName} />
        break
      }
      case 'zielber': {
        const Zielber = lazy(() => import('./Zielber'))
        form = <Zielber dimensions={dimensions} treeName={treeName} />
        break
      }
      default:
        form = null
    }
    return form
  }, [fOKey])

  console.log('Daten')

  if (!form) return null

  return (
    <Container data-id={`daten-container${treeName === 'tree' ? 1 : 2}`}>
      <Suspense fallback={<Fallback />}>{form}</Suspense>
    </Container>
  )
}

export default observer(Daten)
