// @flow
/**
 * need to keep class because of ref
 */
import React, { useEffect, useCallback, useContext } from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import clone from 'lodash/clone'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import isEqual from 'lodash/isEqual'
import app from 'ampersand-app'
import { observer } from 'mobx-react-lite'

import LabelFilter from './LabelFilter'
import ApFilter from './ApFilter'
import Tree from './Tree'
import CmApFolder from './contextmenu/ApFolder'
import CmAp from './contextmenu/Ap'
import CmUserFolder from './contextmenu/UserFolder'
import CmUser from './contextmenu/User'
import CmAdresseFolder from './contextmenu/AdresseFolder'
import CmAdresse from './contextmenu/Adresse'
import CmApberuebersichtFolder from './contextmenu/ApberuebersichtFolder'
import CmApberuebersicht from './contextmenu/Apberuebersicht'
import CmAssozartFolder from './contextmenu/AssozartFolder'
import CmAssozart from './contextmenu/Assozart'
import CmEkfzaehleinheitFolder from './contextmenu/EkfzaehleinheitFolder'
import CmEkfzaehleinheit from './contextmenu/Ekfzaehleinheit'
import CmApartFolder from './contextmenu/ApartFolder'
import CmApart from './contextmenu/Apart'
import CmBeobZugeordnetFolder from './contextmenu/BeobZugeordnetFolder'
import CmBerFolder from './contextmenu/BerFolder'
import CmBer from './contextmenu/Ber'
import CmApberFolder from './contextmenu/ApberFolder'
import CmApber from './contextmenu/Apber'
import CmErfkritFolder from './contextmenu/ErfkritFolder'
import CmErfkrit from './contextmenu/Erfkrit'
import CmZielFolder from './contextmenu/ZielFolder'
import CmZielJahrFolder from './contextmenu/ZielJahrFolder'
import CmZiel from './contextmenu/Ziel'
import CmZielBerFolder from './contextmenu/ZielBerFolder'
import CmZielBer from './contextmenu/Zielber'
import CmPopFolder from './contextmenu/PopFolder'
import CmPop from './contextmenu/Pop'
import CmPopmassnberFolder from './contextmenu/PopmassnberFolder'
import CmPopmassnber from './contextmenu/Popmassnber'
import CmPopberFolder from './contextmenu/PopberFolder'
import CmPopber from './contextmenu/Popber'
import CmProjekt from './contextmenu/Projekt'
import CmTpopFolder from './contextmenu/TpopFolder'
import CmTpop from './contextmenu/Tpop'
import CmTpopberFolder from './contextmenu/TpopberFolder'
import CmTpopber from './contextmenu/Tpopber'
import CmBeobZugeordnet from './contextmenu/BeobZugeordnet'
import CmBeobnichtbeurteilt from './contextmenu/Beobnichtbeurteilt'
import CmBeobNichtZuzuordnen from './contextmenu/BeobNichtZuzuordnen'
import CmTpopfreiwkontrFolder from './contextmenu/TpopfreiwkontrFolder'
import CmTpopfreiwkontr from './contextmenu/Tpopfreiwkontr'
import CmTpopfreiwkontrzaehlFolder from './contextmenu/TpopfreiwkontrzaehlFolder'
import CmTpopfreiwkontrzaehl from './contextmenu/Tpopfreiwkontrzaehl'
import CmTpopfeldkontrFolder from './contextmenu/TpopfeldkontrFolder'
import CmTpopfeldkontr from './contextmenu/Tpopfeldkontr'
import CmTpopfeldkontrzaehlFolder from './contextmenu/TpopfeldkontrzaehlFolder'
import CmTpopfeldkontrzaehl from './contextmenu/Tpopfeldkontrzaehl'
import CmTpopmassnberFolder from './contextmenu/TpopmassnberFolder'
import CmTpopmassnber from './contextmenu/Tpopmassnber'
import CmTpopmassnFolder from './contextmenu/TpopmassnFolder'
import CmTpopmassn from './contextmenu/Tpopmassn'
import DeleteDatasetModal from './DeleteDatasetModal'
import ErrorBoundary from '../../shared/ErrorBoundarySingleChild'
import copyBiotopTo from '../../../modules/copyBiotopTo'
import setUrlQueryValue from '../../../modules/setUrlQueryValue'
import moveTo from '../../../modules/moveTo'
import copyTo from '../../../modules/copyTo'
import createNewPopFromBeob from '../../../modules/createNewPopFromBeob'
import setTreeKeyGql from './setTreeKey'
import setTreeKey2Gql from './setTreeKey2'
import copyBeobZugeordnetKoordToTpop from '../../../modules/copyBeobZugeordnetKoordToTpop'
import copyTpopKoordToPop from '../../../modules/copyTpopKoordToPop'
import setCopyingBiotop from './setCopyingBiotop'
import setCopying from './setCopying'
import setMoving from './setMoving'
import tpopById from './tpopById'
import beobById from './beobById'
import openLowerNodes from './openLowerNodes'
import closeLowerNodes from './closeLowerNodes'
import insertDataset from './insertDataset'
import mobxStoreContext from '../../../mobxStoreContext'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-right-color: rgb(46, 125, 50);
  border-right-width: 1px;
  border-right-style: solid;
  border-left-color: rgb(46, 125, 50);
  border-left-width: 1px;
  border-left-style: solid;
  overflow: hidden;
  @media print {
    display: none !important;
  }
`
const LabelFilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 12px;
  padding-top: 5px;
  margin-bottom: 8px;
`
const InnerTreeContainer = styled.div`
  height: 100%;
  overflow: hidden;
`

const getAndValidateCoordinatesOfTpop = async ({ id, addError }) => {
  let tpopResult
  try {
    tpopResult = await app.client.query({
      query: tpopById,
      variables: { id },
    })
  } catch (error) {
    addError(error)
  }
  const tpop = get(tpopResult, 'data.tpopById')
  const { x, y } = tpop
  if (!x || !y) {
    addError(
      new Error(
        `Die Teilpopulation mit der ID ${id} kat keine (vollständigen) Koordinaten`,
      ),
    )
    return { x: null, y: null }
  }
  return { x, y }
}

const getAndValidateCoordinatesOfBeob = async ({ id, addError }) => {
  let beobResult
  try {
    beobResult = await app.client.query({
      query: beobById,
      variables: { id },
    })
  } catch (error) {
    addError(error)
  }
  const beob = get(beobResult, 'data.beobById')
  const { x, y } = beob
  if (!x || !y) {
    addError(
      new Error(
        `Die Teilpopulation mit der ID ${id} kat keine (vollständigen) Koordinaten`,
      ),
    )
    return { x: null, y: null }
  }
  return { x, y }
}

const showMapIfNotYetVisible = (projekteTabs: Array<String>) => {
  const isVisible = projekteTabs.includes('karte')
  if (!isVisible) {
    setUrlQueryValue({
      key: 'projekteTabs',
      value: [...projekteTabs, 'karte'],
    })
  }
}

const enhance = compose(observer)

const TreeContainer = ({
  data: dbData,
  treeName,
  activeNode,
  activeNodes,
  refetchTree,
  nodes,
  data,
  loading,
  moving,
  openNodes,
  copying,
  mapIdsFiltered,
}: {
  treeName: String,
  flex: Number,
  handleClick: () => void,
  data: Object,
  nodes: Array<Object>,
  activeNodes: Object,
  activeNode: Object,
  loading: Boolean,
  moving: Object,
  openNodes: Array<string>,
  copying: Object,
  refetchTree: () => void,
  mapIdsFiltered: Array<String>,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const {
    activeApfloraLayers,
    setActiveApfloraLayers,
    activeOverlays,
    setActiveOverlays,
    popLabelUsingNr,
    setPopLabelUsingNr,
    tpopLabelUsingNr,
    setTpopLabelUsingNr,
    setIdOfTpopBeingLocalized,
    addError,
    toDelete,
    setToDelete,
  } = mobxStore

  const datasetToDelete = toDelete
  const deleteDatasetModalIsVisible = !!datasetToDelete.id
  const tree = get(data, treeName)
  const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
  const token = get(data, 'user.token', null)
  //console.log('TreeContainer rendering')

  useEffect(() => {
    /**
     * if activeNodeArray.length === 1
     * and there is only one projekt
     * open it
     * dont do this in render!
     */
    const { client } = app
    const openNodes = get(data, `${treeName}.openNodes`)
    const projekteNodes = nodes.filter(n => n.menuType === 'projekt')
    const existsOnlyOneProjekt = projekteNodes.length === 1
    const projektNode = projekteNodes[0]
    if (
      activeNodes.projektFolder &&
      !activeNodes.projekt &&
      existsOnlyOneProjekt &&
      projektNode
    ) {
      const projektUrl = clone(projektNode.url)
      client.mutate({
        mutation: setTreeKeyGql,
        variables: {
          value: projektUrl,
          tree: treeName,
          key: 'activeNodeArray',
        },
      })
      // add projekt to open nodes
      client.mutate({
        mutation: setTreeKeyGql,
        variables: {
          value: [...openNodes, projektUrl],
          tree: treeName,
          key: 'openNodes',
        },
      })
    }
  })

  const handleClick = useCallback(
    (e, data, element) => {
      const tree = get(dbData, treeName)
      const { openNodes } = tree
      if (!data) return addError('no data passed with click')
      if (!element) return addError(new Error('no element passed with click'))
      const { table, action, actionTable } = data
      const { firstElementChild } = element
      if (!firstElementChild)
        return addError(new Error('no firstElementChild passed with click'))
      let id = firstElementChild.getAttribute('data-id')
      const parentId = firstElementChild.getAttribute('data-parentid')
      const urlPassed = firstElementChild.getAttribute('data-url')
      const url = JSON.parse(urlPassed)
      const label = firstElementChild.getAttribute('data-label')
      const nodeType = firstElementChild.getAttribute('data-nodetype')
      const menuType = firstElementChild.getAttribute('data-menutype')
      const actions = {
        insert() {
          if (nodeType === 'table') {
            url.pop()
          }
          if (menuType === 'zielFolder') {
            // db sets year 1 as standard
            url.push(1)
          }
          const idToPass = parentId || id
          insertDataset({
            tree,
            tablePassed: table,
            parentId: idToPass,
            url,
            menuType,
            id,
            refetchTree,
            addError,
          })
        },
        openLowerNodes() {
          openLowerNodes({
            tree,
            activeNodes,
            id,
            parentId,
            menuType,
            refetchTree,
          })
        },
        closeLowerNodes() {
          closeLowerNodes({
            tree,
            url,
          })
        },
        delete() {
          const afterDeletionHook = async () => {
            // set it as new activeNodeArray and open node
            const newOpenNodes = openNodes.filter(n => !isEqual(n, url))
            await app.client.mutate({
              mutation: setTreeKey2Gql,
              variables: {
                tree: tree.name,
                value1: url,
                key1: 'activeNodeArray',
                value2: newOpenNodes,
                key2: 'openNodes',
              },
            })
            const tableToUse = [
              'tpopfeldkontrzaehl',
              'tpopfreiwkontrzaehl',
            ].includes(table)
              ? 'tpopkontrzaehl'
              : table
            refetchTree(`${tableToUse}s`)
            refetchTree('aps')
            refetchTree('projekts')
          }
          setToDelete({
            table,
            id,
            label,
            url,
            afterDeletionHook,
          })
        },
        showBeobOnMap() {
          const projekteTabs = get(dbData, 'urlQuery.projekteTabs', [])
          // 1. open map if not yet open
          showMapIfNotYetVisible(projekteTabs)
          // 2 add layer for actionTable
          if (activeOverlays.includes(actionTable)) {
            setActiveOverlays(activeOverlays.filter(o => o !== actionTable))
          } else {
            setActiveOverlays([...activeOverlays, actionTable])
          }
        },
        toggleTooltip() {
          switch (actionTable) {
            case 'pop':
              setPopLabelUsingNr(!popLabelUsingNr)
              break
            case 'tpop':
              setTpopLabelUsingNr(!tpopLabelUsingNr)
              break
            default:
            // Do nothing
          }
        },
        localizeOnMap() {
          const projekteTabs = get(dbData, 'urlQuery.projekteTabs', [])
          setIdOfTpopBeingLocalized(id)
          showMapIfNotYetVisible(projekteTabs)
          setActiveApfloraLayers(uniq([...activeApfloraLayers, 'tpop']))
        },
        markForMoving() {
          app.client.mutate({
            mutation: setMoving,
            variables: { table, id, label },
          })
        },
        move() {
          moveTo({ id, addError })
        },
        markForCopying() {
          app.client.mutate({
            mutation: setCopying,
            variables: { table, id, label, withNextLevel: false },
          })
        },
        markForCopyingWithNextLevel() {
          app.client.mutate({
            mutation: setCopying,
            variables: { table, id, label, withNextLevel: true },
          })
        },
        resetCopying() {
          app.client.mutate({
            mutation: setCopying,
            variables: {
              table: null,
              id: null,
              label: null,
              withNextLevel: false,
            },
          })
        },
        copy() {
          copyTo({ parentId: id, refetchTree, addError })
        },
        markForCopyingBiotop() {
          app.client.mutate({
            mutation: setCopyingBiotop,
            variables: { id, label },
          })
        },
        resetCopyingBiotop() {
          app.client.mutate({
            mutation: setCopyingBiotop,
            variables: { id: 'copyingBiotop', label: null },
          })
        },
        copyBiotop() {
          copyBiotopTo(id)
        },
        copyTpopKoordToPop() {
          copyTpopKoordToPop({ id, addError })
        },
        createNewPopFromBeob() {
          createNewPopFromBeob({
            tree,
            activeNodes,
            id,
            refetchTree,
            addError,
          })
        },
        copyBeobZugeordnetKoordToTpop() {
          copyBeobZugeordnetKoordToTpop({ id, addError })
        },
        async showCoordOfTpopOnMapsZhCh() {
          const { x, y } = await getAndValidateCoordinatesOfTpop({
            id,
            addError,
          })
          if (x && y) {
            window.open(
              `https://maps.zh.ch/?x=${x}&y=${y}&scale=3000&markers=ring`,
              'target="_blank"',
            )
          }
        },
        async showCoordOfTpopOnMapGeoAdminCh() {
          const { x, y } = await getAndValidateCoordinatesOfTpop({
            id,
            addError,
          })
          if (x && y) {
            window.open(
              `https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-farbe&Y=${x}&X=${y}&zoom=10&crosshair=circle`,
              'target="_blank"',
            )
          }
        },
        async showCoordOfBeobOnMapsZhCh() {
          const { x, y } = await getAndValidateCoordinatesOfBeob({
            id,
            addError,
          })
          if (x && y) {
            window.open(
              `https://maps.zh.ch/?x=${x}&y=${y}&scale=3000&markers=ring`,
              'target="_blank"',
            )
          }
        },
        async showCoordOfBeobOnMapGeoAdminCh() {
          const { x, y } = await getAndValidateCoordinatesOfBeob({
            id,
            addError,
          })
          if (x && y) {
            window.open(
              `https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-farbe&Y=${x}&X=${y}&zoom=10&crosshair=circle`,
              'target="_blank"',
            )
          }
        },
      }
      if (Object.keys(actions).includes(action)) {
        actions[action]()
      } else {
        addError(
          new Error(`action "${action}" unknown, therefore not executed`),
        )
      }
    },
    [
      data,
      treeName,
      activeNode,
      activeNodes,
      refetchTree,
      activeApfloraLayers,
      setActiveApfloraLayers,
      activeOverlays,
      setActiveOverlays,
      setIdOfTpopBeingLocalized,
      popLabelUsingNr,
      tpopLabelUsingNr,
      toDelete,
      nodes,
    ],
  )

  return (
    <ErrorBoundary>
      <Container>
        {deleteDatasetModalIsVisible && (
          <DeleteDatasetModal tree={tree} token={token} />
        )}
        <LabelFilterContainer>
          <LabelFilter
            treeName={treeName}
            nodes={nodes}
            activeNode={activeNode}
          />
          {!!activeNodes.projekt && <ApFilter treeName={treeName} />}
        </LabelFilterContainer>
        <InnerTreeContainer>
          <Tree
            treeName={treeName}
            data={data}
            tree={tree}
            nodes={nodes}
            // TODO: is this loading needed?
            loading={loading}
            activeNodeArray={activeNodeArray}
            openNodes={openNodes}
            activeNodes={activeNodes}
            activeApfloraLayers={activeApfloraLayers}
            moving={moving}
            copying={copying}
            mapIdsFiltered={mapIdsFiltered}
          />
        </InnerTreeContainer>
        <CmApFolder onClick={handleClick} tree={tree} token={token} />
        <CmAp onClick={handleClick} tree={tree} token={token} moving={moving} />
        <CmApberuebersichtFolder
          onClick={handleClick}
          tree={tree}
          token={token}
        />
        <CmApberuebersicht onClick={handleClick} tree={tree} token={token} />
        <CmAssozartFolder onClick={handleClick} tree={tree} token={token} />
        <CmEkfzaehleinheitFolder
          onClick={handleClick}
          tree={tree}
          token={token}
        />
        <CmAssozart onClick={handleClick} tree={tree} token={token} />
        <CmEkfzaehleinheit onClick={handleClick} tree={tree} token={token} />
        <CmApartFolder onClick={handleClick} tree={tree} token={token} />
        <CmApart onClick={handleClick} tree={tree} token={token} />
        <CmBeobZugeordnetFolder
          onClick={handleClick}
          tree={tree}
          token={token}
          activeApfloraLayers={activeApfloraLayers}
        />
        <CmBerFolder onClick={handleClick} tree={tree} token={token} />
        <CmBer onClick={handleClick} tree={tree} token={token} />
        <CmApberFolder onClick={handleClick} tree={tree} token={token} />
        <CmApber onClick={handleClick} tree={tree} token={token} />
        <CmErfkritFolder onClick={handleClick} tree={tree} token={token} />
        <CmErfkrit onClick={handleClick} tree={tree} token={token} />
        <CmZielFolder onClick={handleClick} tree={tree} token={token} />
        <CmZielJahrFolder onClick={handleClick} tree={tree} token={token} />
        <CmZiel onClick={handleClick} tree={tree} token={token} />
        <CmZielBerFolder onClick={handleClick} tree={tree} token={token} />
        <CmZielBer onClick={handleClick} tree={tree} token={token} />
        <CmPopFolder
          onClick={handleClick}
          tree={tree}
          token={token}
          moving={moving}
          copying={copying}
        />
        <CmPop
          onClick={handleClick}
          tree={tree}
          token={token}
          moving={moving}
          copying={copying}
        />
        <CmPopmassnberFolder onClick={handleClick} tree={tree} token={token} />
        <CmPopmassnber onClick={handleClick} tree={tree} token={token} />
        <CmPopberFolder onClick={handleClick} tree={tree} token={token} />
        <CmPopber onClick={handleClick} tree={tree} token={token} />
        <CmProjekt onClick={handleClick} tree={tree} token={token} />
        <CmTpopFolder
          onClick={handleClick}
          tree={tree}
          token={token}
          moving={moving}
          copying={copying}
        />
        <CmTpop
          onClick={handleClick}
          tree={tree}
          token={token}
          moving={moving}
          copying={copying}
        />
        <CmTpopberFolder onClick={handleClick} tree={tree} token={token} />
        <CmTpopber onClick={handleClick} tree={tree} token={token} />
        <CmBeobZugeordnet onClick={handleClick} tree={tree} token={token} />
        <CmBeobnichtbeurteilt onClick={handleClick} tree={tree} token={token} />
        <CmBeobNichtZuzuordnen
          onClick={handleClick}
          tree={tree}
          token={token}
        />
        <CmTpopfreiwkontrFolder
          onClick={handleClick}
          tree={tree}
          token={token}
          moving={moving}
          copying={copying}
        />
        <CmTpopfreiwkontr
          onClick={handleClick}
          tree={tree}
          token={token}
          copying={copying}
        />
        <CmTpopfreiwkontrzaehlFolder
          onClick={handleClick}
          tree={tree}
          token={token}
        />
        <CmTpopfreiwkontrzaehl
          onClick={handleClick}
          tree={tree}
          token={token}
        />
        <CmTpopfeldkontrFolder
          onClick={handleClick}
          tree={tree}
          token={token}
          moving={moving}
          copying={copying}
        />
        <CmTpopfeldkontr
          onClick={handleClick}
          tree={tree}
          token={token}
          copying={copying}
        />
        <CmTpopfeldkontrzaehlFolder
          onClick={handleClick}
          tree={tree}
          token={token}
        />
        <CmTpopfeldkontrzaehl onClick={handleClick} tree={tree} token={token} />
        <CmTpopmassnberFolder onClick={handleClick} tree={tree} token={token} />
        <CmTpopmassnber onClick={handleClick} tree={tree} token={token} />
        <CmTpopmassnFolder
          onClick={handleClick}
          tree={tree}
          token={token}
          moving={moving}
          copying={copying}
        />
        <CmTpopmassn
          onClick={handleClick}
          tree={tree}
          token={token}
          copying={copying}
        />
        <CmUserFolder onClick={handleClick} tree={tree} token={token} />
        <CmUser onClick={handleClick} tree={tree} token={token} />
        <CmAdresseFolder onClick={handleClick} tree={tree} token={token} />
        <CmAdresse onClick={handleClick} tree={tree} token={token} />
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(TreeContainer)
