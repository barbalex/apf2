import memoizeOne from 'memoize-one'

import allParentNodesAreOpenModule from '../allParentNodesAreOpen'
import buildProjektNodes from './projekt'
import buildUserFolderNodes from './userFolder'
import buildCurrentIssuesFolderNodes from './currentIssuesFolder'
import buildMessagesFolderNodes from './messagesFolder'
import buildWlFolderNodes from './wlFolder'
import buildAdresseFolderNodes from './adresseFolder'
import buildAdresseNodes from './adresse'
import buildApberrelevantGrundWerteFolderNodes from './apberrelevantGrundWerteFolder'
import buildApberrelevantGrundWerteNodes from './apberrelevantGrundWerte'
import buildTpopkontrzaehlEinheitWerteFolderNodes from './tpopkontrzaehlEinheitWerteFolder'
import buildTpopkontrzaehlEinheitWerteNodes from './tpopkontrzaehlEinheitWerte'
import buildEkAbrechnungstypWerteFolderNodes from './ekAbrechnungstypWerteFolder'
import buildEkAbrechnungstypWerteNodes from './ekAbrechnungstypWerte'
import buildUserNodes from './user'
import buildCurrentIssuesNodes from './currentIssues'
import buildApFolderNodes from './apFolder'
import buildApberuebersichtFolderNodes from './apberuebersichtFolder'
import buildApberuebersichtNodes from './apberuebersicht'
import buildApNodes from './ap'
import buildPopFolderNode from './popFolder'
import qkFolderNodes from './qkFolder'
import buildBeobNichtZuzuordnenFolderNodes from './beobNichtZuzuordnenFolder'
import buildBeobNichtBeurteiltFolderNodes from './beobNichtBeurteiltFolder'
import buildAssozartFolderNodes from './assozartFolder'
import buildEkzaehleinheitFolderNodes from './ekzaehleinheitFolder'
import buildEkfrequenzFolderNodes from './ekfrequenzFolder'
import buildApartFolderNodes from './apartFolder'
import buildIdealbiotopFolderNodes from './idealbiotopFolder'
import buildBerFolderNodes from './berFolder'
import buildApberFolderNodes from './apberFolder'
import buildAperfkritFolderNodes from './aperfkritFolder'
import buildApzielFolderNodes from './apzielFolder'
import buildApzieljahrFolderNodes from './apzieljahrFolder'
import buildApzielNodes from './apziel'
import buildApzielberFolderNodes from './apzielberFolder'
import buildApzielberNodes from './apzielber'
import buildPopNodes from './pop'
import buildBeobNichtZuzuordnenNodes from './beobNichtZuzuordnen'
import buildBeobNichtBeurteiltNodes from './beobNichtBeurteilt'
import buildAssozartNodes from './assozart'
import buildEkzaehleinheitNodes from './ekzaehleinheit'
import buildEkfrequenzNodes from './ekfrequenz'
import buildApartNodes from './apart'
import buildBerNodes from './ber'
import buildApberNodes from './apber'
import buildAperfkritNodes from './aperfkrit'
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
import buildTpopmassnNodes from './tpopmassn'
import buildTpopfeldkontrzaehlFolderNodes from './tpopfeldkontrzaehlFolder'
import buildTpopfeldkontrzaehlNodes from './tpopfeldkontrzaehl'
import buildTpopfreiwkontrzaehlFolderNodes from './tpopfreiwkontrzaehlFolder'
import buildTpopfreiwkontrzaehlNodes from './tpopfreiwkontrzaehl'
import sort from '../sort'
import allParentNodesExist from '../allParentNodesExist'

const compare = (a, b) => {
  // sort a before, if it has no value at this index
  if (a !== 0 && !a) return -1
  // sort a after if b has no value at this index
  if (b !== 0 && !b) return 1
  // sort a before if its value is smaller
  return a - b
}

export default ({
  data,
  dataZiels,
  loadingAll,
  loadingZiels,
  loadingIdealbiotops,
  store,
  nodeFilter,
  role,
  treeName,
}) => {
  const openNodes = store[treeName].openNodes
    .toJSON()
    // need to sort so folders are added in correct order
    // because every lower folder gets previous nodes passed
    .sort(sort)
  //console.log('nodes', { data, openNodes })
  const projektNodes = [...buildProjektNodes({ data, treeName, store })]

  let nodes = [
    ...projektNodes,
    ...memoizeOne(() =>
      buildUserFolderNodes({
        data,
        treeName,
        projektNodes,
        loading: loadingAll,
        store,
      }),
    )(),
    ...memoizeOne(() =>
      buildCurrentIssuesFolderNodes({
        data,
        treeName,
        projektNodes,
        loading: loadingAll,
        store,
      }),
    )(),
    ...memoizeOne(() =>
      buildMessagesFolderNodes({
        data,
        treeName,
        projektNodes,
        loading: loadingAll,
        store,
      }),
    )(),
  ]
  if (role === 'apflora_manager') {
    nodes = [
      ...nodes,
      ...memoizeOne(() => buildWlFolderNodes({ projektNodes }))(),
    ]
  }
  let apNodes
  let popNodes
  let tpopNodes
  let tpopfeldkontrNodes
  let tpopfreiwkontrNodes
  let apzieljahrFolderNodes
  let apzielNodes

  /**
   * We ALWAYS add an array of nodes,
   * never a single one
   * not even for folders that are never more than one
   * because the function adding the nodes
   * should be able to pass none as well
   * for instance if a parent node is not open
   * or some filter is active
   */
  openNodes.forEach(nodeUrl => {
    const allParentNodesAreOpen = allParentNodesAreOpenModule(
      openNodes,
      nodeUrl,
    )
    if (
      nodeUrl[0] === 'Projekte' &&
      // do not process ['Projekte']
      nodeUrl.length > 1
    ) {
      const projId = nodeUrl[1]
      if (nodeUrl.length === 2 && nodeUrl[0] === 'Projekte') {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildApFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projektNodes,
              projId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildApberuebersichtFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projektNodes,
              projId,
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 3 &&
        nodeUrl[2] === 'AP-Berichte' &&
        allParentNodesAreOpen
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildApberuebersichtNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projektNodes,
              projId,
              store,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 3 && nodeUrl[2] === 'Aktionspläne') {
        apNodes = memoizeOne(() =>
          buildApNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            projektNodes,
            projId,
            store,
          }),
        )()
        nodes = [...nodes, ...apNodes]
      }
      if (nodeUrl.length === 4 && nodeUrl[2] === 'Aktionspläne') {
        const apId = nodeUrl[3]
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildPopFolderNode({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projektNodes,
              projId,
              apNodes,
              apId,
              nodeFilter: nodeFilter[treeName],
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildApzielFolderNodes({
              nodes,
              data: dataZiels,
              treeName,
              loading: loadingZiels,
              apNodes,
              projektNodes,
              projId,
              apId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildAperfkritFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildApberFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildBerFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildIdealbiotopFolderNodes({
              nodes,
              treeName,
              loading: loadingIdealbiotops,
              apNodes,
              projektNodes,
              projId,
              apId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildAssozartFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildEkzaehleinheitFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildEkfrequenzFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildApartFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildBeobNichtBeurteiltFolderNodes({
              nodes,
              data: data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildBeobNichtZuzuordnenFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            qkFolderNodes({
              nodes,
              apNodes,
              projektNodes,
              projId,
              apId,
            }),
          )(),
        ]
      }
      // if nodeUrl.length > 4, nodeUrl[2] is always 'Aktionspläne'
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'AP-Ziele' &&
        allParentNodesAreOpen
      ) {
        apzieljahrFolderNodes = memoizeOne(() =>
          buildApzieljahrFolderNodes({
            nodes,
            data: dataZiels,
            treeName,
            loading: loadingZiels,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            store,
          }),
        )()
        nodes = [...nodes, ...apzieljahrFolderNodes]
      }
      if (
        nodeUrl.length === 6 &&
        nodeUrl[4] === 'AP-Ziele' &&
        allParentNodesAreOpen
      ) {
        apzielNodes = memoizeOne(() =>
          buildApzielNodes({
            nodes,
            data: dataZiels,
            treeName,
            loading: loadingZiels,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            jahr: +nodeUrl[5],
            apzieljahrFolderNodes,
            store,
          }),
        )()
        nodes = [...nodes, ...apzielNodes]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'AP-Ziele' &&
        allParentNodesAreOpen
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildApzielberFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              openNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              zielJahr: +nodeUrl[5],
              apzieljahrFolderNodes,
              zielId: nodeUrl[6],
              apzielNodes,
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 8 &&
        nodeUrl[4] === 'AP-Ziele' &&
        nodeUrl[7] === 'Berichte' &&
        allParentNodesAreOpen
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildApzielberNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              openNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              zielJahr: +nodeUrl[5],
              apzieljahrFolderNodes,
              zielId: nodeUrl[6],
              apzielNodes,
              store,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'Populationen') {
        popNodes = memoizeOne(() =>
          buildPopNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            apNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            store,
          }),
        )()
        nodes = [...nodes, ...popNodes]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'nicht-zuzuordnende-Beobachtungen'
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildBeobNichtZuzuordnenNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'nicht-beurteilte-Beobachtungen'
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildBeobNichtBeurteiltNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              store,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'assoziierte-Arten') {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildAssozartNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              store,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'EK-Zähleinheiten') {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildEkzaehleinheitNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              store,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'EK-Frequenzen') {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildEkfrequenzNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              store,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'AP-Arten') {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildApartNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              store,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'Berichte') {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildBerNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              store,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'AP-Berichte') {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildApberNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              store,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'AP-Erfolgskriterien') {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildAperfkritNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              store,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 6 && nodeUrl[4] === 'Populationen') {
        const apId = nodeUrl[3]
        const popId = nodeUrl[5]
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildTpopFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projektNodes,
              projId,
              apNodes,
              apId,
              popNodes,
              popId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildPopberFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projektNodes,
              projId,
              apNodes,
              apId,
              popNodes,
              popId,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildPopmassnberFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projektNodes,
              projId,
              apNodes,
              apId,
              popNodes,
              popId,
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Massnahmen-Berichte'
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildPopmassnberNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projId,
              projektNodes,
              apId: nodeUrl[3],
              apNodes,
              popId: nodeUrl[5],
              popNodes,
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Kontroll-Berichte'
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildPopberNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projId,
              projektNodes,
              apId: nodeUrl[3],
              apNodes,
              popId: nodeUrl[5],
              popNodes,
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen'
      ) {
        tpopNodes = memoizeOne(() =>
          buildTpopNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            popId: nodeUrl[5],
            popNodes,
            nodeFilter: nodeFilter[treeName],
            store,
          }),
        )()
        nodes = [...nodes, ...tpopNodes]
      }
      if (
        nodeUrl.length === 8 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen'
      ) {
        const apId = nodeUrl[3]
        const popId = nodeUrl[5]
        const tpopId = nodeUrl[7]
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            tpopmassnFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projId,
              projektNodes,
              apId,
              apNodes,
              popId,
              popNodes,
              tpopId,
              tpopNodes,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildTpopmassnberFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projId,
              projektNodes,
              apId,
              apNodes,
              popId,
              popNodes,
              tpopId,
              tpopNodes,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildTpopfeldkontrFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projId,
              projektNodes,
              apId,
              apNodes,
              popId,
              popNodes,
              tpopId,
              tpopNodes,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildTpopfreiwkontrFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projId,
              projektNodes,
              apId,
              apNodes,
              popId,
              popNodes,
              tpopId,
              tpopNodes,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildTpopberFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projId,
              projektNodes,
              apId,
              apNodes,
              popId,
              popNodes,
              tpopId,
              tpopNodes,
              store,
            }),
          )(),
          ...memoizeOne(() =>
            buildBeobZugeordnetFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projId,
              projektNodes,
              apId,
              apNodes,
              popId,
              popNodes,
              tpopId,
              tpopNodes,
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Beobachtungen'
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildBeobZugeordnetNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projId,
              projektNodes,
              apId: nodeUrl[3],
              apNodes,
              popId: nodeUrl[5],
              popNodes,
              tpopId: nodeUrl[7],
              tpopNodes,
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Kontroll-Berichte'
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildTpopberNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projId,
              projektNodes,
              apId: nodeUrl[3],
              apNodes,
              popId: nodeUrl[5],
              popNodes,
              tpopId: nodeUrl[7],
              tpopNodes,
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Freiwilligen-Kontrollen'
      ) {
        tpopfreiwkontrNodes = memoizeOne(() =>
          buildTpopfreiwkontrNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
            store,
          }),
        )()
        nodes = [...nodes, ...tpopfreiwkontrNodes]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Feld-Kontrollen'
      ) {
        tpopfeldkontrNodes = memoizeOne(() =>
          buildTpopfeldkontrNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
            store,
          }),
        )()
        nodes = [...nodes, ...tpopfeldkontrNodes]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Massnahmen-Berichte'
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildTpopmassnberNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projId,
              projektNodes,
              apId: nodeUrl[3],
              apNodes,
              popId: nodeUrl[5],
              popNodes,
              tpopId: nodeUrl[7],
              tpopNodes,
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Massnahmen'
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildTpopmassnNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
              projId,
              projektNodes,
              apId: nodeUrl[3],
              apNodes,
              popId: nodeUrl[5],
              popNodes,
              tpopId: nodeUrl[7],
              tpopNodes,
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 10 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Feld-Kontrollen'
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildTpopfeldkontrzaehlFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
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
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 10 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Freiwilligen-Kontrollen'
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildTpopfreiwkontrzaehlFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
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
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 11 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Feld-Kontrollen'
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildTpopfeldkontrzaehlNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
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
              store,
            }),
          )(),
        ]
      }
      if (
        nodeUrl.length === 11 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Freiwilligen-Kontrollen'
      ) {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildTpopfreiwkontrzaehlNodes({
              nodes,
              data,
              treeName,
              loading: loadingAll,
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
              store,
            }),
          )(),
        ]
      }
    }
    if (nodeUrl.length === 1 && nodeUrl[0] === 'Benutzer') {
      nodes = [
        ...nodes,
        ...memoizeOne(() =>
          buildUserNodes({
            nodes,
            data,
            treeName,
            projektNodes,
            store,
          }),
        )(),
      ]
    }
    if (nodeUrl.length === 1 && nodeUrl[0] === 'Aktuelle-Fehler') {
      nodes = [
        ...nodes,
        ...memoizeOne(() =>
          buildCurrentIssuesNodes({
            nodes,
            data,
            treeName,
            projektNodes,
            store,
          }),
        )(),
      ]
    }
    if (
      role === 'apflora_manager' &&
      nodeUrl.length === 1 &&
      nodeUrl[0] === 'Werte-Listen'
    ) {
      nodes = [
        ...nodes,
        ...memoizeOne(() =>
          buildAdresseFolderNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            projektNodes,
            store,
          }),
        )(),
        ...memoizeOne(() =>
          buildApberrelevantGrundWerteFolderNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            projektNodes,
            store,
          }),
        )(),
        ...memoizeOne(() =>
          buildEkAbrechnungstypWerteFolderNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            projektNodes,
            store,
          }),
        )(),
        ...memoizeOne(() =>
          buildTpopkontrzaehlEinheitWerteFolderNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            projektNodes,
            store,
          }),
        )(),
      ]
    }
    if (
      role === 'apflora_manager' &&
      nodeUrl.length === 2 &&
      nodeUrl[0] === 'Werte-Listen' &&
      nodeUrl[1] === 'Adressen'
    ) {
      nodes = [
        ...nodes,
        ...memoizeOne(() =>
          buildAdresseNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            projektNodes,
            store,
          }),
        )(),
      ]
    }
    if (
      role === 'apflora_manager' &&
      nodeUrl.length === 2 &&
      nodeUrl[0] === 'Werte-Listen' &&
      nodeUrl[1] === 'ApberrelevantGrundWerte'
    ) {
      nodes = [
        ...nodes,
        ...memoizeOne(() =>
          buildApberrelevantGrundWerteNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            projektNodes,
            store,
          }),
        )(),
      ]
    }
    if (
      role === 'apflora_manager' &&
      nodeUrl.length === 2 &&
      nodeUrl[0] === 'Werte-Listen' &&
      nodeUrl[1] === 'EkAbrechnungstypWerte'
    ) {
      nodes = [
        ...nodes,
        ...memoizeOne(() =>
          buildEkAbrechnungstypWerteNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            projektNodes,
            store,
          }),
        )(),
      ]
    }
    if (
      role === 'apflora_manager' &&
      nodeUrl.length === 2 &&
      nodeUrl[0] === 'Werte-Listen' &&
      nodeUrl[1] === 'TpopkontrzaehlEinheitWerte'
    ) {
      nodes = [
        ...nodes,
        ...memoizeOne(() =>
          buildTpopkontrzaehlEinheitWerteNodes({
            nodes,
            data,
            treeName,
            loading: loadingAll,
            projektNodes,
            store,
          }),
        )(),
      ]
    }
  })

  nodes = nodes.filter(n => allParentNodesExist(nodes, n))

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
      compare(a.sort[10], b.sort[10]),
  )
}
