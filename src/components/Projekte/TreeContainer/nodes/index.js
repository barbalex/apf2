// @flow
import memoizeOne from 'memoize-one'

import allParentNodesAreOpenModule from '../allParentNodesAreOpen'
import buildProjektNodes from './projekt'
import buildUserFolderNodes from './userFolder'
import buildCurrentIssuesFolderNodes from './currentIssuesFolder'
import buildWlFolderNodes from './wlFolder'
import buildAdresseFolderNodes from './adresseFolder'
import buildAdresseNodes from './adresse'
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
import buildEkfzaehleinheitFolderNodes from './ekfzaehleinheitFolder'
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
import buildEkfzaehleinheitNodes from './ekfzaehleinheit'
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
  dataCurrentIssues,
  dataAdresses,
  dataApbers,
  dataApberuebersichts,
  dataAps,
  dataAssozarts,
  dataBeobNichtBeurteilts,
  dataBeobNichtZuzuordnens,
  dataBeobZugeordnets,
  dataBers,
  dataEkfzaehleinheits,
  dataErfkrits,
  dataPops,
  dataProjekts,
  dataTpopbers,
  dataTpopfeldkontrs,
  dataTpopfreiwkontrs,
  dataTpopkontrzaehls,
  dataTpopmassnbers,
  dataTpopmassns,
  dataTpops,
  dataUsers,
  dataZielbers,
  dataZiels,
  loadingCurrentIssues,
  loadingAdresses,
  loadingUsers,
  loadingProjekts,
  loadingApberuebersichts,
  loadingAps,
  loadingPops,
  loadingPopbers,
  loadingPopmassnbers,
  loadingTpops,
  loadingTpopmassns,
  loadingTpopmassnbers,
  loadingTpopfeldkontrs,
  loadingTpopfreiwkontrs,
  loadingTpopkontrzaehls,
  loadingTpopbers,
  loadingBeobZugeordnets,
  loadingZiels,
  loadingZielbers,
  loadingErfkrits,
  loadingApbers,
  loadingBers,
  loadingIdealbiotops,
  loadingAparts,
  loadingAssozarts,
  loadingEkfzaehleinheits,
  loadingBeobNichtBeurteilts,
  loadingBeobNichtZuzuordnens,
  mobxStore,
  nodeFilter,
  role,
  treeName,
}: {
  data: Object,
  dataCurrentIssues: Object,
  dataAdresses: Object,
  dataApbers: Object,
  dataApberuebersichts: Object,
  dataAps: Object,
  dataAssozarts: Object,
  dataBeobNichtBeurteilts: Object,
  dataBeobNichtZuzuordnens: Object,
  dataBeobZugeordnets: Object,
  dataBers: Object,
  dataEkfzaehleinheits: Object,
  dataErfkrits: Object,
  dataPops: Object,
  dataProjekts: Object,
  dataTpopbers: Object,
  dataTpopfeldkontrs: Object,
  dataTpopfreiwkontrs: Object,
  dataTpopkontrzaehls: Object,
  dataTpopmassnbers: Object,
  dataTpopmassns: Object,
  dataTpops: Object,
  dataUsers: Object,
  dataZielbers: Object,
  dataZiels: Object,
  loadingAdresses: Boolean,
  loadingUsers: Boolean,
  loadingProjekts: Boolean,
  loadingApberuebersichts: Boolean,
  loadingAps: Boolean,
  loadingPops: Boolean,
  loadingPopbers: Boolean,
  loadingPopmassnbers: Boolean,
  loadingTpops: Boolean,
  loadingTpopmassns: Boolean,
  loadingTpopmassnbers: Boolean,
  loadingTpopfeldkon: Booleantrs,
  loadingTpopfreiwkontrs: Boolean,
  loadingTpopkontrzaeh: Booleanls,
  loadingTpopbers: Boolean,
  loadingBeobZugeordnets: Boolean,
  loadingZiels: Boolean,
  loadingZielbers: Boolean,
  loadingErfkrits: Boolean,
  loadingApbers: Boolean,
  loadingBers: Boolean,
  loadingIdealbiotops: Boolean,
  loadingAparts: Boolean,
  loadingAssozarts: Boolean,
  loadingEkfzaehleinheits: Boolean,
  loadingBeobNichtBeurteilts: Boolean,
  loadingBeobNichtZuzuordnens: Boolean,
  mobxStore: Object,
  nodeFilter: Object,
  role: string,
  treeName: string,
}): Array<Object> => {
  const openNodes = mobxStore[treeName].openNodes
    .toJSON()
    // need to sort so folders are added in correct order
    // because every lower folder gets previous nodes passed
    .sort(sort)
  //console.log('nodes', { data, openNodes })
  const projektNodes = [
    ...buildProjektNodes({ data: dataProjekts, treeName, mobxStore }),
  ]

  let nodes = [
    ...projektNodes,
    ...memoizeOne(() =>
      buildUserFolderNodes({
        data: dataUsers,
        treeName,
        projektNodes,
        loading: loadingUsers,
        mobxStore,
      }),
    )(),
    ...memoizeOne(() =>
      buildCurrentIssuesFolderNodes({
        data: dataCurrentIssues,
        treeName,
        projektNodes,
        loading: loadingUsers,
        mobxStore,
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
              data: dataAps,
              treeName,
              loading: loadingAps,
              projektNodes,
              projId,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildApberuebersichtFolderNodes({
              nodes,
              data: dataApberuebersichts,
              treeName,
              loading: loadingApberuebersichts,
              projektNodes,
              projId,
              mobxStore,
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
              data: dataApberuebersichts,
              treeName,
              loading: loadingApberuebersichts,
              projektNodes,
              projId,
              mobxStore,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 3 && nodeUrl[2] === 'Aktionspläne') {
        apNodes = memoizeOne(() =>
          buildApNodes({
            nodes,
            data: dataAps,
            treeName,
            loading: loadingAps,
            projektNodes,
            projId,
            mobxStore,
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
              data: dataPops,
              treeName,
              loading: loadingPops,
              projektNodes,
              projId,
              apNodes,
              apId,
              nodeFilter: nodeFilter[treeName],
              mobxStore,
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
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildAperfkritFolderNodes({
              nodes,
              data: dataErfkrits,
              treeName,
              loading: loadingErfkrits,
              apNodes,
              projektNodes,
              projId,
              apId,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildApberFolderNodes({
              nodes,
              data: dataApbers,
              treeName,
              loading: loadingApbers,
              apNodes,
              projektNodes,
              projId,
              apId,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildBerFolderNodes({
              nodes,
              data: dataBers,
              treeName,
              loading: loadingBers,
              apNodes,
              projektNodes,
              projId,
              apId,
              mobxStore,
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
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildAssozartFolderNodes({
              nodes,
              data: dataAssozarts,
              treeName,
              loading: loadingAssozarts,
              apNodes,
              projektNodes,
              projId,
              apId,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildEkfzaehleinheitFolderNodes({
              nodes,
              data: dataEkfzaehleinheits,
              treeName,
              loading: loadingEkfzaehleinheits,
              apNodes,
              projektNodes,
              projId,
              apId,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildApartFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingAparts,
              apNodes,
              projektNodes,
              projId,
              apId,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildBeobNichtBeurteiltFolderNodes({
              nodes,
              data: dataBeobNichtBeurteilts,
              treeName,
              loading: loadingBeobNichtBeurteilts,
              apNodes,
              projektNodes,
              projId,
              apId,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildBeobNichtZuzuordnenFolderNodes({
              nodes,
              data: dataBeobNichtZuzuordnens,
              treeName,
              loading: loadingBeobNichtZuzuordnens,
              apNodes,
              projektNodes,
              projId,
              apId,
              mobxStore,
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
            mobxStore,
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
            mobxStore,
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
              data: dataZielbers,
              treeName,
              loading: loadingZielbers,
              apNodes,
              openNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              zielJahr: +nodeUrl[5],
              apzieljahrFolderNodes,
              zielId: nodeUrl[6],
              apzielNodes,
              mobxStore,
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
              data: dataZielbers,
              treeName,
              loading: loadingZielbers,
              apNodes,
              openNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              zielJahr: +nodeUrl[5],
              apzieljahrFolderNodes,
              zielId: nodeUrl[6],
              apzielNodes,
              mobxStore,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'Populationen') {
        popNodes = memoizeOne(() =>
          buildPopNodes({
            nodes,
            data: dataPops,
            treeName,
            loading: loadingPops,
            apNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            mobxStore,
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
              data: dataBeobNichtZuzuordnens,
              treeName,
              loading: loadingBeobNichtZuzuordnens,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              mobxStore,
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
              data: dataBeobNichtBeurteilts,
              treeName,
              loading: loadingBeobNichtBeurteilts,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              mobxStore,
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
              data: dataAssozarts,
              treeName,
              loading: loadingAssozarts,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              mobxStore,
            }),
          )(),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'EKF-Zähleinheiten') {
        nodes = [
          ...nodes,
          ...memoizeOne(() =>
            buildEkfzaehleinheitNodes({
              nodes,
              data: dataEkfzaehleinheits,
              treeName,
              loading: loadingEkfzaehleinheits,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              mobxStore,
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
              loading: loadingAparts,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              mobxStore,
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
              data: dataBers,
              treeName,
              loading: loadingBers,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              mobxStore,
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
              data: dataApbers,
              treeName,
              loading: loadingApbers,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              mobxStore,
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
              data: dataErfkrits,
              treeName,
              loading: loadingErfkrits,
              apNodes,
              projektNodes,
              projId,
              apId: nodeUrl[3],
              mobxStore,
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
              data: dataTpops,
              treeName,
              loading: loadingTpops,
              projektNodes,
              projId,
              apNodes,
              apId,
              popNodes,
              popId,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildPopberFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingPopbers,
              projektNodes,
              projId,
              apNodes,
              apId,
              popNodes,
              popId,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildPopmassnberFolderNodes({
              nodes,
              data,
              treeName,
              loading: loadingPopmassnbers,
              projektNodes,
              projId,
              apNodes,
              apId,
              popNodes,
              popId,
              mobxStore,
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
              loading: loadingPopmassnbers,
              projId,
              projektNodes,
              apId: nodeUrl[3],
              apNodes,
              popId: nodeUrl[5],
              popNodes,
              mobxStore,
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
              loading: loadingPopbers,
              projId,
              projektNodes,
              apId: nodeUrl[3],
              apNodes,
              popId: nodeUrl[5],
              popNodes,
              mobxStore,
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
            data: dataTpops,
            treeName,
            loading: loadingTpops,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            popId: nodeUrl[5],
            popNodes,
            nodeFilter: nodeFilter[treeName],
            mobxStore,
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
              data: dataTpopmassns,
              treeName,
              loading: loadingTpopmassns,
              projId,
              projektNodes,
              apId,
              apNodes,
              popId,
              popNodes,
              tpopId,
              tpopNodes,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildTpopmassnberFolderNodes({
              nodes,
              data: dataTpopmassnbers,
              treeName,
              loading: loadingTpopmassnbers,
              projId,
              projektNodes,
              apId,
              apNodes,
              popId,
              popNodes,
              tpopId,
              tpopNodes,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildTpopfeldkontrFolderNodes({
              nodes,
              data: dataTpopfeldkontrs,
              treeName,
              loading: loadingTpopfeldkontrs,
              projId,
              projektNodes,
              apId,
              apNodes,
              popId,
              popNodes,
              tpopId,
              tpopNodes,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildTpopfreiwkontrFolderNodes({
              nodes,
              data: dataTpopfreiwkontrs,
              treeName,
              loading: loadingTpopfreiwkontrs,
              projId,
              projektNodes,
              apId,
              apNodes,
              popId,
              popNodes,
              tpopId,
              tpopNodes,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildTpopberFolderNodes({
              nodes,
              data: dataTpopbers,
              treeName,
              loading: loadingTpopbers,
              projId,
              projektNodes,
              apId,
              apNodes,
              popId,
              popNodes,
              tpopId,
              tpopNodes,
              mobxStore,
            }),
          )(),
          ...memoizeOne(() =>
            buildBeobZugeordnetFolderNodes({
              nodes,
              data: dataBeobZugeordnets,
              treeName,
              loading: loadingBeobZugeordnets,
              projId,
              projektNodes,
              apId,
              apNodes,
              popId,
              popNodes,
              tpopId,
              tpopNodes,
              mobxStore,
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
              data: dataBeobZugeordnets,
              treeName,
              loading: loadingBeobZugeordnets,
              projId,
              projektNodes,
              apId: nodeUrl[3],
              apNodes,
              popId: nodeUrl[5],
              popNodes,
              tpopId: nodeUrl[7],
              tpopNodes,
              mobxStore,
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
              data: dataTpopbers,
              treeName,
              loading: loadingTpopbers,
              projId,
              projektNodes,
              apId: nodeUrl[3],
              apNodes,
              popId: nodeUrl[5],
              popNodes,
              tpopId: nodeUrl[7],
              tpopNodes,
              mobxStore,
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
            data: dataTpopfreiwkontrs,
            treeName,
            loading: loadingTpopfreiwkontrs,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
            mobxStore,
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
            data: dataTpopfeldkontrs,
            treeName,
            loading: loadingTpopfeldkontrs,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
            mobxStore,
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
              data: dataTpopmassnbers,
              treeName,
              loading: loadingTpopmassnbers,
              projId,
              projektNodes,
              apId: nodeUrl[3],
              apNodes,
              popId: nodeUrl[5],
              popNodes,
              tpopId: nodeUrl[7],
              tpopNodes,
              mobxStore,
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
              data: dataTpopmassns,
              treeName,
              loading: loadingTpopmassns,
              projId,
              projektNodes,
              apId: nodeUrl[3],
              apNodes,
              popId: nodeUrl[5],
              popNodes,
              tpopId: nodeUrl[7],
              tpopNodes,
              mobxStore,
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
              data: dataTpopkontrzaehls,
              treeName,
              loading: loadingTpopkontrzaehls,
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
              mobxStore,
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
              data: dataTpopkontrzaehls,
              treeName,
              loading: loadingTpopkontrzaehls,
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
              mobxStore,
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
            data: dataUsers,
            treeName,
            projektNodes,
            mobxStore,
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
            data: dataCurrentIssues,
            treeName,
            projektNodes,
            mobxStore,
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
            data: dataAdresses,
            treeName,
            loading: loadingAdresses,
            projektNodes,
            mobxStore,
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
            data: dataAdresses,
            treeName,
            loading: loadingAdresses,
            projektNodes,
            mobxStore,
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
