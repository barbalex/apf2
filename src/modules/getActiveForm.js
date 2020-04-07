import get from 'lodash/get'
import isEqual from 'lodash/isEqual'

import getTableNameFromActiveNode from './getTableNameFromActiveNode'

export default ({ store, treeName, nodes }) => {
  const { activeNodeArray } = store[treeName]
  const activeFilterTable = get(store, `${treeName}.dataFilter.activeTable`, '')

  let key
  if (
    activeNodeArray.length === 3 &&
    activeNodeArray[0] === 'Projekte' &&
    activeNodeArray[2] === 'EK-Planung'
  ) {
    key = 'ekplan'
  } else if (activeNodeArray.length > 2 && activeNodeArray[2] === 'Exporte') {
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
    const activeNode = nodes.find((n) => isEqual(n.url, activeNodeArray))
    key = getTableNameFromActiveNode(activeNode)
  }

  const fOKey = activeFilterTable || key
  switch (fOKey) {
    case 'adresse':
    case 'ap':
    case 'apberuebersicht':
    case 'apart':
    case 'apber':
    case 'assozart':
    case 'currentIssue':
    case 'message':
    case 'ekplan':
    case 'ekzaehleinheit':
    case 'ekfrequenz':
    case 'erfkrit':
    case 'exporte':
    case 'idealbiotop':
    case 'pop':
    case 'popber':
    case 'popmassnber':
    case 'projekt':
    case 'qk':
    case 'tpop':
    case 'tpopber':
    case 'tpopfeldkontr':
    case 'tpopfreiwkontr':
    case 'tpopkontrzaehl':
    case 'tpopmassn':
    case 'tpopmassnber':
    case 'user':
    case 'ziel':
    case 'zielber': {
      return { form: fOKey, type: null }
    }
    case 'tpopApberrelevantGrundWerte': {
      return { form: 'werte', type: 'tpop_apberrelevant_grund_werte' }
    }
    case 'tpopkontrzaehlEinheitWerte': {
      return { form: 'werte', type: 'tpopkontrzaehl_einheit_werte' }
    }
    case 'ekAbrechnungstypWerte': {
      return { form: 'werte', type: 'ek_abrechnungstyp_werte' }
    }
    case 'beobNichtBeurteilt': {
      return { form: 'beobzuordnung', type: 'nichtBeurteilt' }
    }
    case 'beobNichtZuzuordnen': {
      return { form: 'beobzuordnung', type: 'nichtZuzuordnen' }
    }
    case 'beobZugeordnet': {
      return { form: 'beobzuordnung', type: 'zugeordnet' }
    }
    default:
      return { form: null, type: null }
  }
}
