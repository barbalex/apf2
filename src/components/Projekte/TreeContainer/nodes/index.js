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

const nodes = ({ data, loading, store, role }) => {
  const openNodes = store.tree.openNodes
    .toJSON()
    // need to sort so folders are added in correct order
    // because every lower folder gets previous nodes passed
    .sort(sort)
  //console.log('nodes', { data, openNodes })
  const projektNodes = buildProjektNodes({ data })

  let nodes = [
    ...projektNodes,
    ...buildUserFolderNodes({
      data,
      projektNodes,
      loading,
      store,
    }),
    ...buildCurrentIssuesFolderNodes({
      data,
      projektNodes,
      loading,
    }),
    ...buildMessagesFolderNodes({
      data,
      projektNodes,
      loading,
    }),
  ]
  if (role === 'apflora_manager') {
    nodes = [...nodes, ...buildWlFolderNodes({ projektNodes })]
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
  openNodes.forEach((nodeUrl) => {
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
          ...buildApFolderNodes({
            data,
            loading,
            projektNodes,
            projId,
            store,
          }),
          ...buildApberuebersichtFolderNodes({
            data,
            loading,
            projektNodes,
            projId,
            store,
          }),
        ]
      }
      if (
        nodeUrl.length === 3 &&
        nodeUrl[2] === 'AP-Berichte' &&
        allParentNodesAreOpen
      ) {
        nodes = [
          ...nodes,
          ...buildApberuebersichtNodes({
            data,
            loading,
            projektNodes,
            projId,
          }),
        ]
      }
      if (nodeUrl.length === 3 && nodeUrl[2] === 'Arten') {
        apNodes = buildApNodes({
          nodes,
          data,
          loading,
          projektNodes,
          projId,
          store,
        })
        nodes = [...nodes, ...apNodes]
      }
      if (nodeUrl.length === 4 && nodeUrl[2] === 'Arten') {
        const apId = nodeUrl[3]
        nodes = [
          ...nodes,
          ...buildPopFolderNode({
            nodes,
            data,
            loading,
            projektNodes,
            projId,
            apNodes,
            apId,
            store,
          }),
          ...buildApzielFolderNodes({
            nodes,
            data,
            loading,
            apNodes,
            projektNodes,
            projId,
            apId,
            store,
          }),
          ...buildAperfkritFolderNodes({
            nodes,
            data,
            loading,
            apNodes,
            projektNodes,
            projId,
            apId,
            store,
          }),
          ...buildApberFolderNodes({
            nodes,
            data,
            loading,
            apNodes,
            projektNodes,
            projId,
            apId,
            store,
          }),
          ...buildIdealbiotopFolderNodes({
            nodes,
            loading,
            apNodes,
            projektNodes,
            projId,
            apId,
            store,
          }),
          ...buildAssozartFolderNodes({
            nodes,
            data,
            loading,
            apNodes,
            projektNodes,
            projId,
            apId,
            store,
          }),
          ...buildEkzaehleinheitFolderNodes({
            nodes,
            data,
            loading,
            apNodes,
            projektNodes,
            projId,
            apId,
            store,
          }),
          ...buildEkfrequenzFolderNodes({
            nodes,
            data,
            loading,
            apNodes,
            projektNodes,
            projId,
            apId,
            store,
          }),
          ...buildApartFolderNodes({
            nodes,
            data,
            loading,
            apNodes,
            projektNodes,
            projId,
            apId,
            store,
          }),
          ...buildBeobNichtBeurteiltFolderNodes({
            nodes,
            data,
            loading,
            apNodes,
            projektNodes,
            projId,
            apId,
            store,
          }),
          ...buildBeobNichtZuzuordnenFolderNodes({
            nodes,
            data,
            loading,
            apNodes,
            projektNodes,
            projId,
            apId,
            store,
          }),
          ...qkFolderNodes({
            nodes,
            apNodes,
            projektNodes,
            projId,
            apId,
          }),
        ]
      }
      // if nodeUrl.length > 4, nodeUrl[2] is always 'Arten'
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'AP-Ziele' &&
        allParentNodesAreOpen
      ) {
        apzieljahrFolderNodes = buildApzieljahrFolderNodes({
          data,
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
        allParentNodesAreOpen
      ) {
        apzielNodes = buildApzielNodes({
          nodes,
          data,
          apNodes,
          openNodes,
          projektNodes,
          projId,
          apId: nodeUrl[3],
          jahr: +nodeUrl[5],
          apzieljahrFolderNodes,
        })
        nodes = [...nodes, ...apzielNodes]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'AP-Ziele' &&
        allParentNodesAreOpen
      ) {
        nodes = [
          ...nodes,
          ...buildApzielberFolderNodes({
            nodes,
            data,
            loading,
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
          ...buildApzielberNodes({
            nodes,
            data,
            apNodes,
            openNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
            zielJahr: +nodeUrl[5],
            apzieljahrFolderNodes,
            zielId: nodeUrl[6],
            apzielNodes,
          }),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'Populationen') {
        popNodes = buildPopNodes({
          nodes,
          data,
          apNodes,
          projektNodes,
          projId,
          apId: nodeUrl[3],
        })
        nodes = [...nodes, ...popNodes]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'nicht-zuzuordnende-Beobachtungen'
      ) {
        nodes = [
          ...nodes,
          ...buildBeobNichtZuzuordnenNodes({
            nodes,
            data,
            apNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (
        nodeUrl.length === 5 &&
        nodeUrl[4] === 'nicht-beurteilte-Beobachtungen'
      ) {
        nodes = [
          ...nodes,
          ...buildBeobNichtBeurteiltNodes({
            data,
            apNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'assoziierte-Arten') {
        nodes = [
          ...nodes,
          ...buildAssozartNodes({
            nodes,
            data,
            apNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'EK-Zähleinheiten') {
        nodes = [
          ...nodes,
          ...buildEkzaehleinheitNodes({
            nodes,
            data,
            apNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'EK-Frequenzen') {
        nodes = [
          ...nodes,
          ...buildEkfrequenzNodes({
            nodes,
            data,
            apNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'Taxa') {
        nodes = [
          ...nodes,
          ...buildApartNodes({
            nodes,
            data,
            loading,
            apNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'AP-Berichte') {
        nodes = [
          ...nodes,
          ...buildApberNodes({
            nodes,
            data,
            loading,
            apNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (nodeUrl.length === 5 && nodeUrl[4] === 'AP-Erfolgskriterien') {
        nodes = [
          ...nodes,
          ...buildAperfkritNodes({
            nodes,
            data,
            apNodes,
            projektNodes,
            projId,
            apId: nodeUrl[3],
          }),
        ]
      }
      if (nodeUrl.length === 6 && nodeUrl[4] === 'Populationen') {
        const apId = nodeUrl[3]
        const popId = nodeUrl[5]
        nodes = [
          ...nodes,
          ...buildTpopFolderNodes({
            nodes,
            data,
            loading,
            projektNodes,
            projId,
            apNodes,
            apId,
            popNodes,
            popId,
            store,
          }),
          ...buildPopberFolderNodes({
            nodes,
            data,
            loading,
            projektNodes,
            projId,
            apNodes,
            apId,
            popNodes,
            popId,
            store,
          }),
          ...buildPopmassnberFolderNodes({
            nodes,
            data,
            loading,
            projektNodes,
            projId,
            apNodes,
            apId,
            popNodes,
            popId,
            store,
          }),
        ]
      }
      if (
        nodeUrl.length === 7 &&
        nodeUrl[4] === 'Populationen' &&
        nodeUrl[6] === 'Massnahmen-Berichte'
      ) {
        nodes = [
          ...nodes,
          ...buildPopmassnberNodes({
            nodes,
            data,
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
        nodeUrl[6] === 'Kontroll-Berichte'
      ) {
        nodes = [
          ...nodes,
          ...buildPopberNodes({
            nodes,
            data,
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
        nodeUrl[6] === 'Teil-Populationen'
      ) {
        tpopNodes = buildTpopNodes({
          nodes,
          data,
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
        nodeUrl[6] === 'Teil-Populationen'
      ) {
        const apId = nodeUrl[3]
        const popId = nodeUrl[5]
        const tpopId = nodeUrl[7]
        nodes = [
          ...nodes,
          ...tpopmassnFolderNodes({
            nodes,
            data,
            loading,
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
          ...buildTpopmassnberFolderNodes({
            nodes,
            data,
            loading,
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
          ...buildTpopfeldkontrFolderNodes({
            nodes,
            data,
            loading,
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
          ...buildTpopfreiwkontrFolderNodes({
            nodes,
            data,
            loading,
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
          ...buildTpopberFolderNodes({
            nodes,
            data,
            loading,
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
          ...buildBeobZugeordnetFolderNodes({
            nodes,
            data,
            loading,
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
          ...buildBeobZugeordnetNodes({
            nodes,
            data,
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
        nodeUrl[8] === 'Kontroll-Berichte'
      ) {
        nodes = [
          ...nodes,
          ...buildTpopberNodes({
            nodes,
            data,
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
        nodeUrl[8] === 'Freiwilligen-Kontrollen'
      ) {
        tpopfreiwkontrNodes = buildTpopfreiwkontrNodes({
          nodes,
          data,
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
        nodeUrl[8] === 'Feld-Kontrollen'
      ) {
        tpopfeldkontrNodes = buildTpopfeldkontrNodes({
          nodes,
          data,
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
        nodeUrl[8] === 'Massnahmen-Berichte'
      ) {
        nodes = [
          ...nodes,
          ...buildTpopmassnberNodes({
            nodes,
            data,
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
        nodeUrl[8] === 'Massnahmen'
      ) {
        nodes = [
          ...nodes,
          ...buildTpopmassnNodes({
            nodes,
            data,
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
        nodeUrl[8] === 'Feld-Kontrollen'
      ) {
        nodes = [
          ...nodes,
          ...buildTpopfeldkontrzaehlFolderNodes({
            nodes,
            data,
            loading,
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
          ...buildTpopfreiwkontrzaehlFolderNodes({
            nodes,
            data,
            loading,
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
          ...buildTpopfeldkontrzaehlNodes({
            nodes,
            data,
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
        nodeUrl[8] === 'Freiwilligen-Kontrollen'
      ) {
        nodes = [
          ...nodes,
          ...buildTpopfreiwkontrzaehlNodes({
            nodes,
            data,
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
    }
    if (nodeUrl.length === 1 && nodeUrl[0] === 'Benutzer') {
      nodes = [
        ...nodes,
        ...buildUserNodes({
          data,
          projektNodes,
        }),
      ]
    }
    if (nodeUrl.length === 1 && nodeUrl[0] === 'Aktuelle-Fehler') {
      nodes = [
        ...nodes,
        ...buildCurrentIssuesNodes({
          data,
          projektNodes,
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
        ...buildAdresseFolderNodes({
          nodes,
          data,
          loading,
          projektNodes,
          store,
        }),
        ...buildApberrelevantGrundWerteFolderNodes({
          nodes,
          data,
          loading,
          projektNodes,
          store,
        }),
        ...buildEkAbrechnungstypWerteFolderNodes({
          nodes,
          data,
          loading,
          projektNodes,
          store,
        }),
        ...buildTpopkontrzaehlEinheitWerteFolderNodes({
          nodes,
          data,
          loading,
          projektNodes,
          store,
        }),
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
        ...buildAdresseNodes({
          nodes,
          data,
          loading,
          projektNodes,
        }),
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
        ...buildApberrelevantGrundWerteNodes({
          nodes,
          data,
          loading,
          projektNodes,
        }),
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
        ...buildEkAbrechnungstypWerteNodes({
          nodes,
          data,
          projektNodes,
        }),
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
        ...buildTpopkontrzaehlEinheitWerteNodes({
          nodes,
          data,
          projektNodes,
        }),
      ]
    }
  })

  nodes = nodes.filter((n) => allParentNodesExist(nodes, n))

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

export default nodes
