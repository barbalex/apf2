// @flow
import { toJS } from 'mobx'

import allParentNodesAreOpen from '../../../../modules/allParentNodesAreOpen'
import allParentNodesAreVisible from '../../../../modules/allParentNodesAreVisible'
import buildProjektNodes from './projekt'
import buildApFolderNodes from './apFolder'
import buildApberuebersichtFolderNodes from './apberuebersichtFolder'
import buildApberuebersichtNodes from './apberuebersicht'
import buildApNodes from './ap'
import buildPopFolderNodes from './popFolder'
import qkFolderNodes from '../../../../modules/nodes/qkFolder'
import beobNichtZuzuordnenFolderNodes from '../../../../modules/nodes/beobNichtZuzuordnenFolder'
import beobzuordnungFolderNodes from '../../../../modules/nodes/beobzuordnungFolder'
import assozartFolderNodes from '../../../../modules/nodes/assozartFolder'
import apartFolderNodes from '../../../../modules/nodes/apartFolder'
import idealbiotopFolderNodes from '../../../../modules/nodes/idealbiotopFolder'
import berFolderNodes from '../../../../modules/nodes/berFolder'
import apberFolderNodes from '../../../../modules/nodes/apberFolder'
import erfkritFolderNodes from '../../../../modules/nodes/erfkritFolder'
import zieljahrFolderNodes from '../../../../modules/nodes/zieljahrFolder'
import zieljahrNodes from '../../../../modules/nodes/zieljahr'
import zielNodes from '../../../../modules/nodes/ziel'
import zielberFolderNodes from '../../../../modules/nodes/zielberFolder'
import zielberNodes from '../../../../modules/nodes/zielber'
import buildPopNodes from './pop'
import beobNichtZuzuordnenNodes from '../../../../modules/nodes/beobNichtZuzuordnen'
import beobzuordnungNodes from '../../../../modules/nodes/beobzuordnung'
import assozartNodes from '../../../../modules/nodes/assozart'
import apartNodes from '../../../../modules/nodes/apart'
import berNodes from '../../../../modules/nodes/ber'
import apberNodes from '../../../../modules/nodes/apber'
import erfkritNodes from '../../../../modules/nodes/erfkrit'
import buildTpopFolderNodes from './tpopFolder'
import buildPopberFolderNodes from './popberFolder'
import buildPopmassnberFolderNodes from './popmassnberFolder'
import buildPopmassnberNodes from './popmassnber'
import buildPopberNodes from './popber'
import buildTpopNodes from './tpop'
import buildBeobZugeordnetFolderNodes from './beobZugeordnetFolder'
import buildTpopberFolderNodes from './tpopberFolder'
import buildTpopfreiwkontrFolderNodes from './tpopfreiwkontrFolder'
import buildTpopfeldkontrFolderNodes from './tpopfeldkontrFolder'
import buildTpopmassnberFolderNodes from './tpopmassnberFolder'
import tpopmassnFolderNodes from './tpopmassnFolder'
import buildBeobZugeordnetNodes from './beobZugeordnet'
import buildTpopberNodes from './tpopber'
import buildTpopfreiwkontrNodes from './tpopfreiwkontr'
import buildTpopfeldkontrNodes from './tpopfeldkontr'
import buildTpopmassnberNodes from './tpopmassnber'
import tpopmassnNodes from './tpopmassn'
import buildTpopfeldkontrzaehlFolderNodes from './tpopfeldkontrzaehlFolder'
import buildTpopfreiwkontrzaehlFolderNodes from './tpopfreiwkontrzaehlFolder'
import buildTpopfeldkontrzaehlNodes from './tpopfeldkontrzaehl'
import buildTpopfreiwkontrzaehlNodes from './tpopfreiwkontrzaehl'

const compare = (a, b) => {
  // sort a before, if it has no value at this index
  if (a !== 0 && !a) return -1
  // sort a after if b has no value at this index
  if (b !== 0 && !b) return 1
  // sort a before if its value is smaller
  return a - b
}

const allParentNodesAreOpenAndVisible = (
  nodes: Array<Object>,
  nodeUrl: Array<string>,
  openNodes: Array<Array<string>>
): boolean =>
  allParentNodesAreVisible(nodes, nodeUrl) &&
  allParentNodesAreOpen(openNodes, nodeUrl)

export default ({
  store,
  tree,
  data,
}: {
  store: Object,
  tree: Object,
  data: Object,
}): Array<Object> => {
  const openNodes = toJS(tree.openNodes)

  const projektNodes = buildProjektNodes({ data, tree })
  let nodes = projektNodes
  let apNodes
  let popNodes
  let tpopNodes
  let tpopfeldkontrNodes
  let tpopfreiwkontrNodes
  // do not process ['Projekte']
  const nodeUrlsToProcess = openNodes.filter(n => n.length > 1)

  nodeUrlsToProcess.forEach(nodeUrl => {
    const projId = nodeUrl[1]
    if (nodeUrl.length === 2) {
      nodes = [
        ...nodes,
        ...buildApFolderNodes({ data, tree, projektNodes, projId }),
        ...buildApberuebersichtFolderNodes({
          data,
          tree,
          projektNodes,
          projId,
        }),
      ]
    }
    if (
      nodeUrl.length === 3 &&
      nodeUrl[2] === 'AP-Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [
        ...nodes,
        ...buildApberuebersichtNodes({ data, tree, projektNodes, projId }),
      ]
    }
    if (
      nodeUrl.length === 3 &&
      nodeUrl[2] === 'Aktionspläne' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      apNodes = buildApNodes({ data, tree, projektNodes, projId })
      nodes = [...nodes, ...apNodes]
    }
    if (
      nodeUrl.length === 4 &&
      nodeUrl[2] === 'Aktionspläne' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      nodes = [
        ...nodes,
        ...buildPopFolderNodes({ data, tree, projektNodes, projId, apId }),
        ...zieljahrFolderNodes(store, tree, projId, apId),
        ...erfkritFolderNodes(store, tree, projId, apId),
        ...apberFolderNodes(store, tree, projId, apId),
        ...berFolderNodes(store, tree, projId, apId),
        ...idealbiotopFolderNodes(store, tree, projId, apId),
        ...assozartFolderNodes(store, tree, projId, apId),
        ...apartFolderNodes(store, tree, projId, apId),
        ...beobzuordnungFolderNodes(store, tree, projId, apId),
        ...beobNichtZuzuordnenFolderNodes(store, tree, projId, apId),
        ...qkFolderNodes(store, tree, projId, apId),
      ]
    }
    // if nodeUrl.length > 4, nodeUrl[2] is always 'Aktionspläne'
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'AP-Ziele' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      nodes = [...nodes, ...zieljahrNodes(store, tree, projId, apId)]
    }
    if (
      nodeUrl.length === 6 &&
      nodeUrl[4] === 'AP-Ziele' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      const zieljahr = nodeUrl[5]
      nodes = [...nodes, ...zielNodes(store, tree, projId, apId, zieljahr)]
    }
    if (
      nodeUrl.length === 7 &&
      nodeUrl[4] === 'AP-Ziele' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      const zieljahr = nodeUrl[5]
      const zielId = nodeUrl[6]
      nodes = [
        ...nodes,
        ...zielberFolderNodes(store, tree, projId, apId, zieljahr, zielId),
      ]
    }
    if (
      nodeUrl.length === 8 &&
      nodeUrl[4] === 'AP-Ziele' &&
      nodeUrl[7] === 'Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      const zieljahr = nodeUrl[5]
      const zielId = nodeUrl[6]
      nodes = [
        ...nodes,
        ...zielberNodes(store, tree, projId, apId, zieljahr, zielId),
      ]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'Populationen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      popNodes = buildPopNodes({
        data,
        tree,
        apNodes,
        projektNodes,
        projId,
        apId: nodeUrl[3],
      })
      nodes = [...nodes, ...popNodes]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'nicht-zuzuordnende-Beobachtungen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      nodes = [...nodes, ...beobNichtZuzuordnenNodes(store, tree, projId, apId)]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'nicht-beurteilte-Beobachtungen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      nodes = [...nodes, ...beobzuordnungNodes(store, tree, projId, apId)]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'assoziierte-Arten' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      nodes = [...nodes, ...assozartNodes(store, tree, projId, apId)]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'AP-Arten' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      nodes = [...nodes, ...apartNodes(store, tree, projId, apId)]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      nodes = [...nodes, ...berNodes(store, tree, projId, apId)]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'AP-Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      nodes = [...nodes, ...apberNodes(store, tree, projId, apId)]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'AP-Erfolgskriterien' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      nodes = [...nodes, ...erfkritNodes(store, tree, projId, apId)]
    }
    if (
      nodeUrl.length === 6 &&
      nodeUrl[4] === 'Populationen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      const popId = nodeUrl[5]
      nodes = [
        ...nodes,
        ...buildTpopFolderNodes({
          data,
          tree,
          projektNodes,
          projId,
          apNodes,
          apId,
          popNodes,
          popId,
        }),
        ...buildPopberFolderNodes({
          data,
          tree,
          projektNodes,
          projId,
          apNodes,
          apId,
          popNodes,
          popId,
        }),
        ...buildPopmassnberFolderNodes({
          data,
          tree,
          projektNodes,
          projId,
          apNodes,
          apId,
          popNodes,
          popId,
        }),
      ]
    }
    if (
      nodeUrl.length === 7 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Massnahmen-Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [
        ...nodes,
        ...buildPopmassnberNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          popId: nodeUrl[5],
          popNodes,
        }),
      ]
    }
    if (
      nodeUrl.length === 7 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Kontroll-Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [
        ...nodes,
        ...buildPopberNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          popId: nodeUrl[5],
          popNodes,
        }),
      ]
    }
    if (
      nodeUrl.length === 7 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      tpopNodes = buildTpopNodes({
        data,
        tree,
        projId,
        projektNodes,
        apId: nodeUrl[3],
        apNodes,
        popId: nodeUrl[5],
        popNodes,
      })
      nodes = [...nodes, ...tpopNodes]
    }
    if (
      nodeUrl.length === 8 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apId = nodeUrl[3]
      const popId = nodeUrl[5]
      const tpopId = nodeUrl[7]
      nodes = [
        ...nodes,
        ...tpopmassnFolderNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId,
          apNodes,
          popId,
          popNodes,
          tpopId,
          tpopNodes,
        }),
        ...buildTpopmassnberFolderNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId,
          apNodes,
          popId,
          popNodes,
          tpopId,
          tpopNodes,
        }),
        ...buildTpopfeldkontrFolderNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId,
          apNodes,
          popId,
          popNodes,
          tpopId,
          tpopNodes,
        }),
        ...buildTpopfreiwkontrFolderNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId,
          apNodes,
          popId,
          popNodes,
          tpopId,
          tpopNodes,
        }),
        ...buildTpopberFolderNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId,
          apNodes,
          popId,
          popNodes,
          tpopId,
          tpopNodes,
        }),
        ...buildBeobZugeordnetFolderNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId,
          apNodes,
          popId,
          popNodes,
          tpopId,
          tpopNodes,
        }),
      ]
    }
    if (
      nodeUrl.length === 9 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Beobachtungen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [
        ...nodes,
        ...buildBeobZugeordnetNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          popId: nodeUrl[5],
          popNodes,
          tpopId: nodeUrl[7],
          tpopNodes,
        }),
      ]
    }
    if (
      nodeUrl.length === 9 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Kontroll-Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [
        ...nodes,
        ...buildTpopberNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          popId: nodeUrl[5],
          popNodes,
          tpopId: nodeUrl[7],
          tpopNodes,
        }),
      ]
    }
    if (
      nodeUrl.length === 9 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Freiwilligen-Kontrollen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      tpopfreiwkontrNodes = buildTpopfreiwkontrNodes({
        data,
        tree,
        projId,
        projektNodes,
        apId: nodeUrl[3],
        apNodes,
        popId: nodeUrl[5],
        popNodes,
        tpopId: nodeUrl[7],
        tpopNodes,
      })
      nodes = [...nodes, ...tpopfreiwkontrNodes]
    }
    if (
      nodeUrl.length === 9 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Feld-Kontrollen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      tpopfeldkontrNodes = buildTpopfeldkontrNodes({
        data,
        tree,
        projId,
        projektNodes,
        apId: nodeUrl[3],
        apNodes,
        popId: nodeUrl[5],
        popNodes,
        tpopId: nodeUrl[7],
        tpopNodes,
      })
      nodes = [...nodes, ...tpopfeldkontrNodes]
    }
    if (
      nodeUrl.length === 9 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Massnahmen-Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [
        ...nodes,
        ...buildTpopmassnberNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          popId: nodeUrl[5],
          popNodes,
          tpopId: nodeUrl[7],
          tpopNodes,
        }),
      ]
    }
    if (
      nodeUrl.length === 9 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Massnahmen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [
        ...nodes,
        ...tpopmassnNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          popId: nodeUrl[5],
          popNodes,
          tpopId: nodeUrl[7],
          tpopNodes,
        }),
      ]
    }
    if (
      nodeUrl.length === 10 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Freiwilligen-Kontrollen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [
        ...nodes,
        ...buildTpopfreiwkontrzaehlFolderNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          popId: nodeUrl[5],
          popNodes,
          tpopId: nodeUrl[7],
          tpopNodes,
          tpopkontrId: nodeUrl[9],
          tpopfreiwkontrNodes,
        }),
      ]
    }
    if (
      nodeUrl.length === 10 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Feld-Kontrollen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [
        ...nodes,
        ...buildTpopfeldkontrzaehlFolderNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          popId: nodeUrl[5],
          popNodes,
          tpopId: nodeUrl[7],
          tpopNodes,
          tpopkontrId: nodeUrl[9],
          tpopfeldkontrNodes,
        }),
      ]
    }
    if (
      nodeUrl.length === 11 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Feld-Kontrollen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [
        ...nodes,
        ...buildTpopfeldkontrzaehlNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          popId: nodeUrl[5],
          popNodes,
          tpopId: nodeUrl[7],
          tpopNodes,
          tpopkontrId: nodeUrl[9],
          tpopfeldkontrNodes,
        }),
      ]
    }
    if (
      nodeUrl.length === 11 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Freiwilligen-Kontrollen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [
        ...nodes,
        ...buildTpopfreiwkontrzaehlNodes({
          data,
          tree,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          popId: nodeUrl[5],
          popNodes,
          tpopId: nodeUrl[7],
          tpopNodes,
          tpopkontrId: nodeUrl[9],
          tpopfreiwkontrNodes,
        }),
      ]
    }
  })

  /**
   * As all nodes are now in one flat list,
   * we need to sort them
   *
   * This is the sorting algorithm:
   *
   * compare the sort array value in the nodes
   * to determine sorting
   *
   * compare arrays element by element, starting with first
   * if a has no value at this index (> a is folder), sort a before b
   * if b has no value at this index (> b is folder), sort a after b
   * if a is smaller than b, sort a before b
   * if both array elements at this index are same,
   * compare values at next index
   *
   * see: stackoverflow.com/questions/13211709/javascript-sort-array-by-multiple-number-fields
   */
  return nodes.sort(
    (a, b) =>
      compare(a.sort[0], b.sort[0]) ||
      compare(a.sort[1], b.sort[1]) ||
      compare(a.sort[2], b.sort[2]) ||
      compare(a.sort[3], b.sort[3]) ||
      compare(a.sort[4], b.sort[4]) ||
      compare(a.sort[5], b.sort[5]) ||
      compare(a.sort[6], b.sort[6]) ||
      compare(a.sort[7], b.sort[7]) ||
      compare(a.sort[8], b.sort[8]) ||
      compare(a.sort[9], b.sort[9]) ||
      compare(a.sort[10], b.sort[10])
  )
}
