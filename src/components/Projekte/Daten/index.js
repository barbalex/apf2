import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import get from 'lodash/get'
import loadable from '@loadable/component'

/**
 * ReactDOMServer does not yet support Suspense
 */

//import Fallback from '../../shared/Fallback'
import getTableNameFromActiveNode from '../../../modules/getTableNameFromActiveNode'
import storeContext from '../../../storeContext'

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

const Daten = ({ treeName }) => {
  const store = useContext(storeContext)
  const { activeNodeArray, activeNode } = store[treeName]
  const activeTable = get(store, `nodeFilter.${treeName}.activeTable`, '')

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
        const Adresse = loadable(() => import('./Adresse'))
        form = <Adresse treeName={treeName} />
        break
      }
      case 'tpopApberrelevantGrundWerte': {
        const Werte = loadable(() => import('./Werte'))
        form = (
          <Werte treeName={treeName} table="tpop_apberrelevant_grund_werte" />
        )
        break
      }
      case 'ap': {
        const Ap = loadable(() => import('./Ap'))
        form = <Ap treeName={treeName} />
        break
      }
      case 'apberuebersicht': {
        const Apberuebersicht = loadable(() => import('./Apberuebersicht'))
        form = <Apberuebersicht treeName={treeName} />
        break
      }
      case 'apart': {
        const Apart = loadable(() => import('./Apart'))
        form = <Apart treeName={treeName} />
        break
      }
      case 'apber': {
        const Apber = loadable(() => import('./Apber'))
        form = <Apber treeName={treeName} />
        break
      }
      case 'assozart': {
        const Assozart = loadable(() => import('./Assozart'))
        form = <Assozart treeName={treeName} />
        break
      }
      case 'beobNichtBeurteilt': {
        const Beobzuordnung = loadable(() => import('./Beobzuordnung'))
        form = <Beobzuordnung treeName={treeName} type="nichtBeurteilt" />
        break
      }
      case 'beobNichtZuzuordnen': {
        const Beobzuordnung = loadable(() => import('./Beobzuordnung'))
        form = <Beobzuordnung treeName={treeName} type="nichtZuzuordnen" />
        break
      }
      case 'beobZugeordnet': {
        const Beobzuordnung = loadable(() => import('./Beobzuordnung'))
        form = <Beobzuordnung treeName={treeName} type="zugeordnet" />
        break
      }
      case 'ber': {
        const Ber = loadable(() => import('./Ber'))
        form = <Ber treeName={treeName} />
        break
      }
      case 'currentIssue': {
        const CurrentIssue = loadable(() => import('./CurrentIssue'))
        form = <CurrentIssue treeName={treeName} />
        break
      }
      case 'ekfzaehleinheit': {
        const Ekfzaehleinheit = loadable(() => import('./Ekfzaehleinheit'))
        form = <Ekfzaehleinheit treeName={treeName} />
        break
      }
      case 'erfkrit': {
        const Erfkrit = loadable(() => import('./Erfkrit'))
        form = <Erfkrit treeName={treeName} />
        break
      }
      case 'exporte': {
        const Exporte = loadable(() => import('../Exporte'))
        form = <Exporte />
        break
      }
      case 'idealbiotop': {
        const Idealbiotop = loadable(() => import('./Idealbiotop'))
        form = <Idealbiotop treeName={treeName} />
        break
      }
      case 'pop': {
        const Pop = loadable(() => import('./Pop'))
        form = <Pop treeName={treeName} />
        break
      }
      case 'popber': {
        const Popber = loadable(() => import('./Popber'))
        form = <Popber treeName={treeName} />
        break
      }
      case 'popmassnber': {
        const Popmassnber = loadable(() => import('./Popmassnber'))
        form = <Popmassnber treeName={treeName} />
        break
      }
      case 'projekt': {
        const Projekt = loadable(() => import('./Projekt'))
        form = <Projekt treeName={treeName} />
        break
      }
      case 'qk': {
        const Qk = loadable(() => import('./Qk'))
        form = <Qk treeName={treeName} />
        break
      }
      case 'tpop': {
        const Tpop = loadable(() => import('./Tpop'))
        form = <Tpop treeName={treeName} />
        break
      }
      case 'tpopber': {
        const Tpopber = loadable(() => import('./Tpopber'))
        form = <Tpopber treeName={treeName} />
        break
      }
      case 'tpopfeldkontr': {
        const Tpopfeldkontr = loadable(() => import('./Tpopfeldkontr'))
        form = <Tpopfeldkontr treeName={treeName} />
        break
      }
      case 'tpopfreiwkontr': {
        const Tpopfreiwkontr = loadable(() => import('./Tpopfreiwkontr'))
        form = <Tpopfreiwkontr treeName={treeName} />
        break
      }
      case 'tpopkontrzaehl': {
        const Tpopkontrzaehl = loadable(() => import('./Tpopkontrzaehl'))
        form = <Tpopkontrzaehl treeName={treeName} />
        break
      }
      case 'tpopkontrzaehlEinheitWerte': {
        const Werte = loadable(() => import('./Werte'))
        form = (
          <Werte treeName={treeName} table="tpopkontrzaehl_einheit_werte" />
        )
        break
      }
      case 'tpopmassn': {
        const Tpopmassn = loadable(() => import('./Tpopmassn'))
        form = <Tpopmassn treeName={treeName} />
        break
      }
      case 'tpopmassnber': {
        const Tpopmassnber = loadable(() => import('./Tpopmassnber'))
        form = <Tpopmassnber treeName={treeName} />
        break
      }
      case 'user': {
        const User = loadable(() => import('./User'))
        form = <User treeName={treeName} />
        break
      }
      case 'ziel': {
        const Ziel = loadable(() => import('./Ziel'))
        form = <Ziel treeName={treeName} />
        break
      }
      case 'zielber': {
        const Zielber = loadable(() => import('./Zielber'))
        form = <Zielber treeName={treeName} />
        break
      }
      default:
        form = null
    }
    return form
  }, [fOKey])

  //console.log('Daten', { form, fOKey, activeTable, key })

  if (!form) return null

  /**
   * ReactDOMServer does not yet support Suspense
   */

  return (
    <Container data-id={`daten-container${treeName === 'tree' ? 1 : 2}`}>
      {/*<Suspense fallback={<Fallback />}>*/}
      {form}
      {/*</Suspense>*/}
    </Container>
  )
}

export default observer(Daten)
