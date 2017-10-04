// @flow
// for sorting see:
// //stackoverflow.com/questions/13211709/javascript-sort-array-by-multiple-number-fields
// also: needed to account for elements not having the next array elements
// to be sorted before those that have
// that is why there is if (a !== 0 && !a)

import { toJS } from 'mobx'
import allParentNodesAreOpen from '../../modules/allParentNodesAreOpen'
import allParentNodesAreVisible from '../../modules/allParentNodesAreVisible'
import projektNodes from '../../modules/nodes/projekt'
import apFolderNodes from '../../modules/nodes/apFolder'
import apberuebersichtFolderNodes from '../../modules/nodes/apberuebersichtFolder'
import apberuebersichtNodes from '../../modules/nodes/apberuebersicht'
import apNodes from '../../modules/nodes/ap'
import popFolderNodes from '../../modules/nodes/popFolder'
import qkFolderNodes from '../../modules/nodes/qkFolder'
import beobNichtZuzuordnenFolderNodes from '../../modules/nodes/beobNichtZuzuordnenFolder'
import beobzuordnungFolderNodes from '../../modules/nodes/beobzuordnungFolder'
import assozartFolderNodes from '../../modules/nodes/assozartFolder'
import beobArtFolderNodes from '../../modules/nodes/beobArtFolder'
import idealbiotopFolderNodes from '../../modules/nodes/idealbiotopFolder'
import berFolderNodes from '../../modules/nodes/berFolder'
import apberFolderNodes from '../../modules/nodes/apberFolder'
import erfkritFolderNodes from '../../modules/nodes/erfkritFolder'
import zieljahrFolderNodes from '../../modules/nodes/zieljahrFolder'
import zieljahrNodes from '../../modules/nodes/zieljahr'
import zielNodes from '../../modules/nodes/ziel'
import zielberFolderNodes from '../../modules/nodes/zielberFolder'
import zielberNodes from '../../modules/nodes/zielber'
import popNodes from '../../modules/nodes/pop'
import beobNichtZuzuordnenNodes from '../../modules/nodes/beobNichtZuzuordnen'
import beobzuordnungNodes from '../../modules/nodes/beobzuordnung'
import assozartNodes from '../../modules/nodes/assozart'
import beobartNodes from '../../modules/nodes/beobart'
import berNodes from '../../modules/nodes/ber'
import apberNodes from '../../modules/nodes/apber'
import erfkritNodes from '../../modules/nodes/erfkrit'
import tpopFolderNodes from '../../modules/nodes/tpopFolder'
import popberFolderNodes from '../../modules/nodes/popberFolder'
import popmassnberFolderNodes from '../../modules/nodes/popmassnberFolder'
import popmassnberNodes from '../../modules/nodes/popmassnber'
import popberNodes from '../../modules/nodes/popber'
import tpopNodes from '../../modules/nodes/tpop'
import tpopbeobFolderNodes from '../../modules/nodes/tpopbeobFolder'
import tpopberFolderNodes from '../../modules/nodes/tpopberFolder'
import tpopfreiwkontrFolderNodes from '../../modules/nodes/tpopfreiwkontrFolder'
import tpopfeldkontrFolderNodes from '../../modules/nodes/tpopfeldkontrFolder'
import tpopmassnberFolderNodes from '../../modules/nodes/tpopmassnberFolder'
import tpopmassnFolderNodes from '../../modules/nodes/tpopmassnFolder'
import tpopbeobNodes from '../../modules/nodes/tpopbeob'
import tpopberNodes from '../../modules/nodes/tpopber'
import tpopfreiwkontrNodes from '../../modules/nodes/tpopfreiwkontr'
import tpopfeldkontrNodes from '../../modules/nodes/tpopfeldkontr'
import tpopmassnberNodes from '../../modules/nodes/tpopmassnber'
import tpopmassnNodes from '../../modules/nodes/tpopmassn'
import tpopfeldkontrzaehlFolderNodes from '../../modules/nodes/tpopfeldkontrzaehlFolder'
import tpopfreiwkontrzaehlFolderNodes from '../../modules/nodes/tpopfreiwkontrzaehlFolder'
import tpopfeldkontrzaehlNodes from '../../modules/nodes/tpopfeldkontrzaehl'
import tpopfreiwkontrzaehlNodes from '../../modules/nodes/tpopfreiwkontrzaehl'

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
  nodeUrl: Array<string | number>,
  openNodes: Array<Array<string | number>>
): boolean =>
  allParentNodesAreVisible(nodes, nodeUrl) &&
  allParentNodesAreOpen(openNodes, nodeUrl)

export default (store: Object, tree: Object): Array<Object> => {
  const openNodes = toJS(tree.openNodes)

  let nodes = projektNodes(store, tree)
  // do not process ['Projekte']
  const nodeUrlsToProcess = openNodes.filter(n => n.length > 1)

  nodeUrlsToProcess.forEach(nodeUrl => {
    const projId = nodeUrl[1]
    if (nodeUrl.length === 2) {
      nodes = [
        ...nodes,
        ...apFolderNodes(store, tree, projId),
        ...apberuebersichtFolderNodes(store, tree, projId),
      ]
    }
    if (
      nodeUrl.length === 3 &&
      nodeUrl[2] === 'AP-Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [...nodes, ...apberuebersichtNodes(store, tree, projId)]
    }
    if (
      nodeUrl.length === 3 &&
      nodeUrl[2] === 'Arten' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      nodes = [...nodes, ...apNodes(store, tree, projId)]
    }
    if (
      nodeUrl.length === 4 &&
      nodeUrl[2] === 'Arten' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      nodes = [
        ...nodes,
        ...popFolderNodes(store, tree, projId, apArtId),
        ...zieljahrFolderNodes(store, tree, projId, apArtId),
        ...erfkritFolderNodes(store, tree, projId, apArtId),
        ...apberFolderNodes(store, tree, projId, apArtId),
        ...berFolderNodes(store, tree, projId, apArtId),
        ...idealbiotopFolderNodes(store, tree, projId, apArtId),
        ...assozartFolderNodes(store, tree, projId, apArtId),
        ...beobArtFolderNodes(store, tree, projId, apArtId),
        ...beobzuordnungFolderNodes(store, tree, projId, apArtId),
        ...beobNichtZuzuordnenFolderNodes(store, tree, projId, apArtId),
        ...qkFolderNodes(store, tree, projId, apArtId),
      ]
    }
    // if nodeUrl.length > 4, nodeUrl[2] is always 'Arten'
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'AP-Ziele' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      nodes = [...nodes, ...zieljahrNodes(store, tree, projId, apArtId)]
    }
    if (
      nodeUrl.length === 6 &&
      nodeUrl[4] === 'AP-Ziele' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const zieljahr = nodeUrl[5]
      nodes = [...nodes, ...zielNodes(store, tree, projId, apArtId, zieljahr)]
    }
    if (
      nodeUrl.length === 7 &&
      nodeUrl[4] === 'AP-Ziele' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const zieljahr = nodeUrl[5]
      const zielId = nodeUrl[6]
      nodes = [
        ...nodes,
        ...zielberFolderNodes(store, tree, projId, apArtId, zieljahr, zielId),
      ]
    }
    if (
      nodeUrl.length === 8 &&
      nodeUrl[4] === 'AP-Ziele' &&
      nodeUrl[7] === 'Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const zieljahr = nodeUrl[5]
      const zielId = nodeUrl[6]
      nodes = [
        ...nodes,
        ...zielberNodes(store, tree, projId, apArtId, zieljahr, zielId),
      ]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'Populationen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      nodes = [...nodes, ...popNodes(store, tree, projId, apArtId)]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'nicht-zuzuordnende-Beobachtungen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      nodes = [
        ...nodes,
        ...beobNichtZuzuordnenNodes(store, tree, projId, apArtId),
      ]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'nicht-beurteilte-Beobachtungen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      nodes = [...nodes, ...beobzuordnungNodes(store, tree, projId, apArtId)]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'assoziierte-Arten' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      nodes = [...nodes, ...assozartNodes(store, tree, projId, apArtId)]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'arten-fuer-beobachtungen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      nodes = [...nodes, ...beobartNodes(store, tree, projId, apArtId)]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      nodes = [...nodes, ...berNodes(store, tree, projId, apArtId)]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'AP-Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      nodes = [...nodes, ...apberNodes(store, tree, projId, apArtId)]
    }
    if (
      nodeUrl.length === 5 &&
      nodeUrl[4] === 'AP-Erfolgskriterien' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      nodes = [...nodes, ...erfkritNodes(store, tree, projId, apArtId)]
    }
    if (
      nodeUrl.length === 6 &&
      nodeUrl[4] === 'Populationen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      nodes = [
        ...nodes,
        ...tpopFolderNodes(store, tree, projId, apArtId, popId),
        ...popberFolderNodes(store, tree, projId, apArtId, popId),
        ...popmassnberFolderNodes(store, tree, projId, apArtId, popId),
      ]
    }
    if (
      nodeUrl.length === 7 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Massnahmen-Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      nodes = [
        ...nodes,
        ...popmassnberNodes(store, tree, projId, apArtId, popId),
      ]
    }
    if (
      nodeUrl.length === 7 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Kontroll-Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      nodes = [...nodes, ...popberNodes(store, tree, projId, apArtId, popId)]
    }
    if (
      nodeUrl.length === 7 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      nodes = [...nodes, ...tpopNodes(store, tree, projId, apArtId, popId)]
    }
    if (
      nodeUrl.length === 8 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      const tpopId = nodeUrl[7]
      nodes = [
        ...nodes,
        ...tpopmassnFolderNodes(store, tree, projId, apArtId, popId, tpopId),
        ...tpopmassnberFolderNodes(store, tree, projId, apArtId, popId, tpopId),
        ...tpopfeldkontrFolderNodes(
          store,
          tree,
          projId,
          apArtId,
          popId,
          tpopId
        ),
        ...tpopfreiwkontrFolderNodes(
          store,
          tree,
          projId,
          apArtId,
          popId,
          tpopId
        ),
        ...tpopberFolderNodes(store, tree, projId, apArtId, popId, tpopId),
        ...tpopbeobFolderNodes(store, tree, projId, apArtId, popId, tpopId),
      ]
    }
    if (
      nodeUrl.length === 9 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Beobachtungen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      const tpopId = nodeUrl[7]
      nodes = [
        ...nodes,
        ...tpopbeobNodes(store, tree, projId, apArtId, popId, tpopId),
      ]
    }
    if (
      nodeUrl.length === 9 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Kontroll-Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      const tpopId = nodeUrl[7]
      nodes = [
        ...nodes,
        ...tpopberNodes(store, tree, projId, apArtId, popId, tpopId),
      ]
    }
    if (
      nodeUrl.length === 9 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Freiwilligen-Kontrollen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      const tpopId = nodeUrl[7]
      nodes = [
        ...nodes,
        ...tpopfreiwkontrNodes(store, tree, projId, apArtId, popId, tpopId),
      ]
    }
    if (
      nodeUrl.length === 9 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Feld-Kontrollen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      const tpopId = nodeUrl[7]
      nodes = [
        ...nodes,
        ...tpopfeldkontrNodes(store, tree, projId, apArtId, popId, tpopId),
      ]
    }
    if (
      nodeUrl.length === 9 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Massnahmen-Berichte' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      const tpopId = nodeUrl[7]
      nodes = [
        ...nodes,
        ...tpopmassnberNodes(store, tree, projId, apArtId, popId, tpopId),
      ]
    }
    if (
      nodeUrl.length === 9 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Massnahmen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      const tpopId = nodeUrl[7]
      nodes = [
        ...nodes,
        ...tpopmassnNodes(store, tree, projId, apArtId, popId, tpopId),
      ]
    }
    if (
      nodeUrl.length === 10 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Freiwilligen-Kontrollen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      const tpopId = nodeUrl[7]
      const tpopkontrId = nodeUrl[9]
      nodes = [
        ...nodes,
        ...tpopfreiwkontrzaehlFolderNodes(
          store,
          tree,
          projId,
          apArtId,
          popId,
          tpopId,
          tpopkontrId
        ),
      ]
    }
    if (
      nodeUrl.length === 10 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Feld-Kontrollen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      const tpopId = nodeUrl[7]
      const tpopkontrId = nodeUrl[9]
      nodes = [
        ...nodes,
        ...tpopfeldkontrzaehlFolderNodes(
          store,
          tree,
          projId,
          apArtId,
          popId,
          tpopId,
          tpopkontrId
        ),
      ]
    }
    if (
      nodeUrl.length === 11 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Feld-Kontrollen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      const tpopId = nodeUrl[7]
      const tpopkontrId = nodeUrl[9]
      nodes = [
        ...nodes,
        ...tpopfeldkontrzaehlNodes(
          store,
          tree,
          projId,
          apArtId,
          popId,
          tpopId,
          tpopkontrId
        ),
      ]
    }
    if (
      nodeUrl.length === 11 &&
      nodeUrl[4] === 'Populationen' &&
      nodeUrl[6] === 'Teil-Populationen' &&
      nodeUrl[8] === 'Freiwilligen-Kontrollen' &&
      allParentNodesAreOpenAndVisible(nodes, nodeUrl, openNodes)
    ) {
      const apArtId = nodeUrl[3]
      const popId = nodeUrl[5]
      const tpopId = nodeUrl[7]
      const tpopkontrId = nodeUrl[9]
      nodes = [
        ...nodes,
        ...tpopfreiwkontrzaehlNodes(
          store,
          tree,
          projId,
          apArtId,
          popId,
          tpopId,
          tpopkontrId
        ),
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
