import getTableNameFromActiveNode from './getTableNameFromActiveNode'

export default ({ url, activeNode, activeFilterTable }) => {
  let key
  if (url.length === 3 && url[0] === 'Projekte' && url[2] === 'EK-Planung') {
    key = 'ekplan'
  } else if (url.length > 2 && url[2] === 'Exporte') {
    key = 'exporte'
  } else if (url.length > 4 && url[4] === 'Qualitaetskontrollen') {
    key = 'qk'
  } else if (url.length > 5 && url[4] === 'nicht-zuzuordnende-Beobachtungen') {
    key = 'beobNichtZuzuordnen'
  } else if (url.length > 5 && url[4] === 'nicht-beurteilte-Beobachtungen') {
    key = 'beobNichtBeurteilt'
  } else if (
    url.length > 9 &&
    url[6] === 'Teil-Populationen' &&
    url[8] === 'Beobachtungen'
  ) {
    key = 'beobZugeordnet'
  } else {
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
    case 'ber':
    case 'currentIssue':
    case 'ekplan':
    case 'ekzaehleinheit':
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
