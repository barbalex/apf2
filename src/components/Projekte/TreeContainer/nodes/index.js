// @flow
import uniqBy from 'lodash/uniqBy'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import buildProjektNodes from './projekt'
import buildUserFolderNode from './userFolder'
import buildWlFolderNode from './wlFolder'
import buildAdresseFolderNode from './adresseFolder'
import buildAdresseNodes from './adresse'
import buildUserNodes from './user'
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
  treeName,
  role,
  dataAdresses,
  dataUsers,
  dataProjekts,
  dataApberuebersichts,
  dataAps,
  dataPops,
  dataPopbers,
  dataPopmassnbers,
  dataTpops,
  dataTpopmassns,
  dataTpopmassnbers,
  dataTpopfeldkontrs,
  dataTpopfreiwkontrs,
  dataTpopkontrzaehls,
  dataTpopbers,
  dataBeobZugeordnets,
  dataZiels,
  dataZielbers,
  dataErfkrits,
  dataApbers,
  dataBers,
  dataIdealbiotops,
  dataAparts,
  dataAssozarts,
  dataEkfzaehleinheits,
  dataBeobNichtBeurteilts,
  dataBeobNichtZuzuordnens,
  dataPopForMap,
  dataTpopForMap,
  dataBeobNichtBeurteiltForMap,
  dataBeobNichtZuzuordnenForMap,
  dataBeobZugeordnetForMap,
  dataBeobZugeordnetForMapMarkers,
  dataBeobNichtBeurteiltForMapMarkers,
  dataBeobNichtZuzuordnenForMapMarkers,
  dataBeobZugeordnetAssignPolylinesForMap,
  dataPopForMapMarkers,
  dataBeobAssignLines,
  nodeFilter,
  mobxStore,
}: {
  data: Object,
  treeName: string,
  role: string,
  dataAdresses: Object,
  dataUsers: Object,
  dataProjekts: Object,
  dataApberuebersichts: Object,
  dataAps: Object,
  dataPops: Object,
  dataPopbers: Object,
  dataPopmassnbers: Object,
  dataTpops: Object,
  dataTpopmassns: Object,
  dataTpopmassnbers: Object,
  dataTpopfeldkontrs: Object,
  dataTpopfreiwkontrs: Object,
  dataTpopkontrzaehls: Object,
  dataTpopbers: Object,
  dataBeobZugeordnets: Object,
  dataZiels: Object,
  dataZielbers: Object,
  dataErfkrits: Object,
  dataApbers: Object,
  dataBers: Object,
  dataIdealbiotops: Object,
  dataAparts: Object,
  dataAssozarts: Object,
  dataEkfzaehleinheits: Object,
  dataBeobNichtBeurteilts: Object,
  dataBeobNichtZuzuordnens: Object,
  dataPopForMap: Object,
  dataTpopForMap: Object,
  dataBeobNichtBeurteiltForMap: Object,
  dataBeobNichtZuzuordnenForMap: Object,
  dataBeobZugeordnetForMap: Object,
  dataBeobZugeordnetForMapMarkers: Object,
  dataBeobNichtBeurteiltForMapMarkers: Object,
  dataBeobNichtZuzuordnenForMapMarkers: Object,
  dataBeobZugeordnetAssignPolylinesForMap: Object,
  dataPopForMapMarkers: Object,
  dataBeobAssignLines: Object,
  nodeFilter: Object,
  mobxStore: Object,
}): Array<Object> => {
  const openNodes = mobxStore[treeName].openNodes
    .toJSON()
    // need to sort so folders are added in correct order
    // because every lower folder gets previous nodes passed
    .sort(sort)
  //console.log('nodes', { data, openNodes })
  const projektNodes = [...buildProjektNodes({ data, treeName, mobxStore })]
  const userFolderNode = buildUserFolderNode({
    data,
    treeName,
    projektNodes,
    loading: dataUsers.loading,
    mobxStore,
  })

  let nodes = [...projektNodes, userFolderNode]
  if (role === 'apflora_manager') {
    nodes = [...nodes, buildWlFolderNode({ projektNodes, mobxStore })]
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
    if (
      nodeUrl[0] === 'Projekte' &&
      // do not process ['Projekte']
      nodeUrl.length > 1
    ) {
      const projId = nodeUrl[1]
      if (nodeUrl.length === 2 && nodeUrl[0] === 'Projekte') {
        /**
         * TODO:
         * can build calls be memoized?
         */
        nodes = [
          ...nodes,
          ...buildApFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataAps.loading,
            projektNodes,
            projId,
            nodeFilter: nodeFilter[treeName],
            mobxStore,
          }),
          ...buildApberuebersichtFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataApberuebersichts.loading,
            projektNodes,
            projId,
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 3 &&
        nodeUrl[2] === 'AP-Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildApberuebersichtNodes({
            nodes,
            data,
            treeName,
            loading: dataApberuebersichts.loading,
            projektNodes,
            projId,
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 3 &&
        nodeUrl[2] === 'Aktionspläne' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        apNodes = buildApNodes({
          nodes,
          data,
          treeName,
          loading: dataAps.loading,
          projektNodes,
          projId,
          nodeFilter: nodeFilter[treeName],
          mobxStore,
        })
        nodes = [...nodes, ...apNodes]
      }
      if (
        nodeUrl.length === 4 &&
        nodeUrl[2] === 'Aktionspläne' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        const apId = nodeUrl[3]
        nodes = [
          ...nodes,
          ...buildPopFolderNode({
            nodes,
            data,
            treeName,
            loading: dataPops.loading,
            projektNodes,
            projId,
            apNodes,
            openNodes,
            apId,
            nodeFilter: nodeFilter[treeName],
            mobxStore,
          }),
          ...buildApzielFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataZiels.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
            mobxStore,
          }),
          ...buildAperfkritFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataErfkrits.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
            mobxStore,
          }),
          ...buildApberFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataApbers.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
            mobxStore,
          }),
          ...buildBerFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataBers.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
            mobxStore,
          }),
          ...buildIdealbiotopFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataIdealbiotops.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
            mobxStore,
          }),
          ...buildAssozartFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataAssozarts.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
            mobxStore,
          }),
          ...buildEkfzaehleinheitFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataEkfzaehleinheits.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
            mobxStore,
          }),
          ...buildApartFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataAparts.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
            mobxStore,
          }),
          ...buildBeobNichtBeurteiltFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataBeobNichtBeurteilts.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
            mobxStore,
          }),
          ...buildBeobNichtZuzuordnenFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataBeobNichtZuzuordnens.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
            mobxStore,
          }),
          ...qkFolderNodes({
            nodes,
            data,
            treeName,
            loading: false,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId,
            mobxStore,
          }),
        ]
      }
      // if nodeUrl.length > 4, nodeUrl[2] is always 'Aktionspläne'
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'AP-Ziele' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        apzieljahrFolderNodes = buildApzieljahrFolderNodes({
          nodes,
          data,
          treeName,
          loading: dataZiels.loading,
          apNodes,
          openNodes,
          projektNodes,
          projId,
          apId: nodeUrl[3],
        })
        nodes = [...nodes, ...apzieljahrFolderNodes]
      }
      if (
        nodeUrl.length === 6 &&
        nodeUrl[4] === 'AP-Ziele' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        apzielNodes = buildApzielNodes({
          nodes,
          data,
          treeName,
          loading: dataZiels.loading,
          apNodes,
          openNodes,
          projektNodes,
          projId,
          apId: nodeUrl[3],
          jahr: +nodeUrl[5],
          apzieljahrFolderNodes,
          mobxStore,
        })
        nodes = [...nodes, ...apzielNodes]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'AP-Ziele' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildApzielberFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataZielbers.loading,
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
        ]
      }
      if (
        nodeUrl.length === 8 &&
        nodeUrl[4] === 'AP-Ziele' &&
        nodeUrl[7] === 'Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildApzielberNodes({
            nodes,
            data,
            treeName,
            loading: dataZielbers.loading,
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
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'Populationen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        popNodes = buildPopNodes({
          nodes,
          data,
          treeName,
          loading: dataPops.loading,
          apNodes,
          openNodes,
          projektNodes,
          projId,
          apId: nodeUrl[3],
          nodeFilter: nodeFilter[treeName],
          mobxStore,
        })
        nodes = [...nodes, ...popNodes]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'nicht-zuzuordnende-Beobachtungen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildBeobNichtZuzuordnenNodes({
            nodes,
            data,
            treeName,
            loading: dataBeobNichtZuzuordnens.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'nicht-beurteilte-Beobachtungen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildBeobNichtBeurteiltNodes({
            nodes,
            data,
            treeName,
            loading: dataBeobNichtBeurteilts.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'assoziierte-Arten' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildAssozartNodes({
            nodes,
            data,
            treeName,
            loading: dataAssozarts.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'EKF-Zähleinheiten' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildEkfzaehleinheitNodes({
            nodes,
            data,
            treeName,
            loading: dataEkfzaehleinheits.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'AP-Arten' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildApartNodes({
            nodes,
            data,
            treeName,
            loading: dataAparts.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildBerNodes({
            nodes,
            data,
            treeName,
            loading: dataBers.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'AP-Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildApberNodes({
            nodes,
            data,
            treeName,
            loading: dataApbers.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'AP-Erfolgskriterien' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildAperfkritNodes({
            nodes,
            data,
            treeName,
            loading: dataErfkrits.loading,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 6 &&
        nodeUrl[4] === 'Populationen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        const apId = nodeUrl[3]
        const popId = nodeUrl[5]
        nodes = [
          ...nodes,
          ...buildTpopFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataTpops.loading,
            projektNodes,
            projId,
            apNodes,
            openNodes,
            apId,
            popNodes,
            popId,
            nodeFilter: nodeFilter[treeName],
            mobxStore,
          }),
          ...buildPopberFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataPopbers.loading,
            projektNodes,
            projId,
            apNodes,
            openNodes,
            apId,
            popNodes,
            popId,
            mobxStore,
          }),
          ...buildPopmassnberFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataPopmassnbers.loading,
            projektNodes,
            projId,
            apNodes,
            openNodes,
            apId,
            popNodes,
            popId,
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Massnahmen-Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildPopmassnberNodes({
            nodes,
            data,
            treeName,
            loading: dataPopmassnbers.loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Kontroll-Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildPopberNodes({
            nodes,
            data,
            treeName,
            loading: dataPopbers.loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        tpopNodes = buildTpopNodes({
          nodes,
          data,
          treeName,
          loading: dataTpops.loading,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          openNodes,
          popId: nodeUrl[5],
          popNodes,
          nodeFilter: nodeFilter[treeName],
          mobxStore,
        })
        nodes = [...nodes, ...tpopNodes]
      }
      if (
        nodeUrl.length === 8 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        const apId = nodeUrl[3]
        const popId = nodeUrl[5]
        const tpopId = nodeUrl[7]
        nodes = [
          ...nodes,
          ...tpopmassnFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataTpopmassns.loading,
            projId,
            projektNodes,
            apId,
            apNodes,
            openNodes,
            popId,
            popNodes,
            tpopId,
            tpopNodes,
            nodeFilter: nodeFilter[treeName],
            mobxStore,
          }),
          ...buildTpopmassnberFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataTpopmassnbers.loading,
            projId,
            projektNodes,
            apId,
            apNodes,
            openNodes,
            popId,
            popNodes,
            tpopId,
            tpopNodes,
            mobxStore,
          }),
          ...buildTpopfeldkontrFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataTpopfeldkontrs.loading,
            projId,
            projektNodes,
            apId,
            apNodes,
            openNodes,
            popId,
            popNodes,
            tpopId,
            tpopNodes,
            nodeFilter: nodeFilter[treeName],
            mobxStore,
          }),
          ...buildTpopfreiwkontrFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataTpopfreiwkontrs.loading,
            projId,
            projektNodes,
            apId,
            apNodes,
            openNodes,
            popId,
            popNodes,
            tpopId,
            tpopNodes,
            nodeFilter: nodeFilter[treeName],
            mobxStore,
          }),
          ...buildTpopberFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataTpopbers.loading,
            projId,
            projektNodes,
            apId,
            apNodes,
            openNodes,
            popId,
            popNodes,
            tpopId,
            tpopNodes,
            mobxStore,
          }),
          ...buildBeobZugeordnetFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataBeobZugeordnets.loading,
            projId,
            projektNodes,
            apId,
            apNodes,
            openNodes,
            popId,
            popNodes,
            tpopId,
            tpopNodes,
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Beobachtungen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildBeobZugeordnetNodes({
            nodes,
            data,
            treeName,
            loading: dataBeobZugeordnets.loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Kontroll-Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildTpopberNodes({
            nodes,
            data,
            treeName,
            loading: dataTpopbers.loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Freiwilligen-Kontrollen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        tpopfreiwkontrNodes = buildTpopfreiwkontrNodes({
          nodes,
          data,
          treeName,
          loading: dataTpopfreiwkontrs.loading,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          openNodes,
          popId: nodeUrl[5],
          popNodes,
          tpopId: nodeUrl[7],
          tpopNodes,
          nodeFilter: nodeFilter[treeName],
          mobxStore,
        })
        nodes = [...nodes, ...tpopfreiwkontrNodes]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Feld-Kontrollen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        tpopfeldkontrNodes = buildTpopfeldkontrNodes({
          nodes,
          data,
          treeName,
          loading: dataTpopfeldkontrs.loading,
          projId,
          projektNodes,
          apId: nodeUrl[3],
          apNodes,
          openNodes,
          popId: nodeUrl[5],
          popNodes,
          tpopId: nodeUrl[7],
          tpopNodes,
          nodeFilter: nodeFilter[treeName],
          mobxStore,
        })
        nodes = [...nodes, ...tpopfeldkontrNodes]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Massnahmen-Berichte' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildTpopmassnberNodes({
            nodes,
            data,
            treeName,
            loading: dataTpopmassnbers.loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 9 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Massnahmen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildTpopmassnNodes({
            nodes,
            data,
            treeName,
            loading: dataTpopmassns.loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
            nodeFilter: nodeFilter[treeName],
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 10 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Feld-Kontrollen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildTpopfeldkontrzaehlFolderNodes({
            nodes,
            data,
            treeName,
            loading: dataTpopkontrzaehls.loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
            tpopkontrId: nodeUrl[9],
            tpopfeldkontrNodes,
            mobxStore,
          }),
        ]
      }
      if (
        nodeUrl.length === 11 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Teil-Populationen' &&
        nodeUrl[8] === 'Feld-Kontrollen' &&
        allParentNodesAreOpen(openNodes, nodeUrl)
      ) {
        nodes = [
          ...nodes,
          ...buildTpopfeldkontrzaehlNodes({
            nodes,
            data,
            treeName,
            loading: dataTpopkontrzaehls.loading,
            projId,
            projektNodes,
            apId: nodeUrl[3],
            apNodes,
            openNodes,
            popId: nodeUrl[5],
            popNodes,
            tpopId: nodeUrl[7],
            tpopNodes,
            tpopkontrId: nodeUrl[9],
            tpopfeldkontrNodes,
            mobxStore,
          }),
        ]
      }
    }
    if (nodeUrl.length === 1 && nodeUrl[0] === 'Benutzer') {
      nodes = [
        ...nodes,
        ...buildUserNodes({
          nodes,
          data,
          treeName,
          projektNodes,
          mobxStore,
        }),
      ]
    }
    if (
      role === 'apflora_manager' &&
      nodeUrl.length === 1 &&
      nodeUrl[0] === 'Werte-Listen'
    ) {
      nodes = [
        ...nodes,
        buildAdresseFolderNode({
          nodes,
          data,
          treeName,
          loading: dataAdresses.loading,
          projektNodes,
          mobxStore,
        }),
      ]
    }
    if (
      role === 'apflora_manager' &&
      nodeUrl.length === 2 &&
      nodeUrl[0] === 'Werte-Listen' &&
      nodeUrl[1] === 'Adressen' &&
      allParentNodesAreOpen(openNodes, nodeUrl)
    ) {
      nodes = [
        ...nodes,
        ...buildAdresseNodes({
          nodes,
          data,
          treeName,
          loading: dataAdresses.loading,
          projektNodes,
          mobxStore,
        }),
      ]
    }
  })

  nodes = nodes.filter(n => allParentNodesExist(nodes, n))
  /**
   * There is something weird happening when filtering data
   * that leads to duplicate nodes
   * Need to solve that but in the meantime use uniqBy
   */
  nodes = uniqBy(nodes, n => n.url.join())

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
