// @flow
/**
 * need to keep class because of ref
 */
import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'

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
import CmWerteListen from './contextmenu/WerteListen'
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
import copyBeobZugeordnetKoordToTpop from '../../../modules/copyBeobZugeordnetKoordToTpop'
import copyTpopKoordToPop from '../../../modules/copyTpopKoordToPop'
import tpopById from './tpopById'
import beobById from './beobById'
import openLowerNodes from './openLowerNodes'
import closeLowerNodes from './closeLowerNodes'
import insertDataset from './insertDataset'
import mobxStoreContext from '../../../mobxStoreContext'

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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

const getAndValidateCoordinatesOfTpop = async ({ id, addError, client }) => {
  let tpopResult
  try {
    tpopResult = await client.query({
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

const getAndValidateCoordinatesOfBeob = async ({ id, addError, client }) => {
  let beobResult
  try {
    beobResult = await client.query({
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

const TreeContainer = ({
  treeName,
  dimensions,
}: {
  treeName: String,
  dimensions: Object,
}) => {
  const client = useApolloClient()
  const mobxStore = useContext(mobxStoreContext)
  const {
    activeApfloraLayers,
    setActiveApfloraLayers,
    activeOverlays,
    setIdOfTpopBeingLocalized,
    addError,
    toDeleteId,
    setToDelete,
    setCopying,
    copying,
    moving,
    setMoving,
    copyingBiotop,
    setCopyingBiotop,
    urlQuery,
    setUrlQuery,
    refetch,
  } = mobxStore
  const { openNodes, setOpenNodes, setActiveNodeArray } = mobxStore[treeName]
  const { projekt } = mobxStore[`${treeName}ActiveNodes`]

  const handleClick = useCallback(
    (e, data, element) => {
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
            treeName,
            tablePassed: table,
            parentId: idToPass,
            url,
            menuType,
            id,
            client,
            mobxStore,
          })
        },
        openLowerNodes() {
          openLowerNodes({
            treeName,
            id,
            parentId,
            menuType,
            client,
            mobxStore,
          })
        },
        closeLowerNodes() {
          closeLowerNodes({
            treeName,
            url,
            mobxStore,
          })
        },
        delete() {
          const afterDeletionHook = () => {
            // set it as new activeNodeArray and open node
            const newOpenNodes = openNodes.filter(n => !isEqual(n, url))
            setActiveNodeArray(url)
            setOpenNodes(newOpenNodes)
            const tableToUse = [
              'tpopfeldkontrzaehl',
              'tpopfreiwkontrzaehl',
            ].includes(table)
              ? 'tpopkontrzaehl'
              : table
            refetch[`${tableToUse}s`]()
            refetch.aps()
            refetch.projekts()
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
          const { projekteTabs } = urlQuery
          // 1. open map if not yet open
          showMapIfNotYetVisible(projekteTabs)
          // 2 add layer for actionTable
          if (activeApfloraLayers.includes(actionTable)) {
            setActiveApfloraLayers(
              activeApfloraLayers.filter(o => o !== actionTable),
            )
          } else {
            setActiveApfloraLayers([...activeApfloraLayers, actionTable])
          }
        },
        localizeOnMap() {
          const { projekteTabs } = urlQuery
          setIdOfTpopBeingLocalized(id)
          showMapIfNotYetVisible(projekteTabs)
          setActiveApfloraLayers(uniq([...activeApfloraLayers, 'tpop']))
        },
        markForMoving() {
          setMoving({ table, id, label })
        },
        move() {
          moveTo({ id, addError, client, moving, setMoving })
        },
        markForCopying() {
          setCopying({ table, id, label, withNextLevel: false })
        },
        markForCopyingWithNextLevel() {
          setCopying({ table, id, label, withNextLevel: true })
        },
        resetCopying() {
          setCopying({
            table: null,
            id: null,
            label: null,
            withNextLevel: false,
          })
        },
        copy() {
          copyTo({
            parentId: id,
            client,
            copying,
            mobxStore,
          })
        },
        markForCopyingBiotop() {
          setCopyingBiotop({ id, label })
        },
        resetCopyingBiotop() {
          setCopyingBiotop({ id: null, label: null })
        },
        copyBiotop() {
          copyBiotopTo({ id, copyingBiotop, client })
        },
        copyTpopKoordToPop() {
          copyTpopKoordToPop({ id, addError, client })
        },
        createNewPopFromBeob() {
          createNewPopFromBeob({
            treeName,
            id,
            client,
            mobxStore,
          })
        },
        copyBeobZugeordnetKoordToTpop() {
          copyBeobZugeordnetKoordToTpop({ id, addError, client })
        },
        async showCoordOfTpopOnMapsZhCh() {
          const { x, y } = await getAndValidateCoordinatesOfTpop({
            id,
            addError,
            client,
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
            client,
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
            client,
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
            client,
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
    [treeName, activeApfloraLayers, activeOverlays, toDeleteId],
  )
  const showMapIfNotYetVisible = useCallback((projekteTabs: Array<String>) => {
    const isVisible = projekteTabs.includes('karte')
    if (!isVisible) {
      setUrlQueryValue({
        key: 'projekteTabs',
        value: [...projekteTabs, 'karte'],
        urlQuery,
        setUrlQuery,
      })
    }
  })

  //console.log('TreeContainer',{data})

  return (
    <ErrorBoundary>
      <Container data-id={`tree-container${treeName === 'tree' ? 1 : 2}`}>
        {!!toDeleteId && <DeleteDatasetModal treeName={treeName} />}
        <LabelFilterContainer>
          <LabelFilter treeName={treeName} />
          {!!projekt && <ApFilter treeName={treeName} />}
        </LabelFilterContainer>
        <InnerTreeContainer>
          <Tree treeName={treeName} dimensions={dimensions} />
        </InnerTreeContainer>
        <CmApFolder onClick={handleClick} treeName={treeName} />
        <CmAp onClick={handleClick} treeName={treeName} />
        <CmApberuebersichtFolder onClick={handleClick} treeName={treeName} />
        <CmApberuebersicht onClick={handleClick} treeName={treeName} />
        <CmAssozartFolder onClick={handleClick} treeName={treeName} />
        <CmEkfzaehleinheitFolder onClick={handleClick} treeName={treeName} />
        <CmAssozart onClick={handleClick} treeName={treeName} />
        <CmEkfzaehleinheit onClick={handleClick} treeName={treeName} />
        <CmApartFolder onClick={handleClick} treeName={treeName} />
        <CmApart onClick={handleClick} treeName={treeName} />
        <CmBeobZugeordnetFolder onClick={handleClick} treeName={treeName} />
        <CmBerFolder onClick={handleClick} treeName={treeName} />
        <CmBer onClick={handleClick} treeName={treeName} />
        <CmApberFolder onClick={handleClick} treeName={treeName} />
        <CmApber onClick={handleClick} treeName={treeName} />
        <CmErfkritFolder onClick={handleClick} treeName={treeName} />
        <CmErfkrit onClick={handleClick} treeName={treeName} />
        <CmZielFolder onClick={handleClick} treeName={treeName} />
        <CmZielJahrFolder onClick={handleClick} treeName={treeName} />
        <CmZiel onClick={handleClick} treeName={treeName} />
        <CmZielBerFolder onClick={handleClick} treeName={treeName} />
        <CmZielBer onClick={handleClick} treeName={treeName} />
        <CmPopFolder onClick={handleClick} treeName={treeName} />
        <CmPop onClick={handleClick} treeName={treeName} />
        <CmPopmassnberFolder onClick={handleClick} treeName={treeName} />
        <CmPopmassnber onClick={handleClick} treeName={treeName} />
        <CmPopberFolder onClick={handleClick} treeName={treeName} />
        <CmPopber onClick={handleClick} treeName={treeName} />
        <CmProjekt onClick={handleClick} treeName={treeName} />
        <CmWerteListen onClick={handleClick} treeName={treeName} />
        <CmTpopFolder onClick={handleClick} treeName={treeName} />
        <CmTpop onClick={handleClick} treeName={treeName} />
        <CmTpopberFolder onClick={handleClick} treeName={treeName} />
        <CmTpopber onClick={handleClick} treeName={treeName} />
        <CmBeobZugeordnet onClick={handleClick} treeName={treeName} />
        <CmBeobnichtbeurteilt onClick={handleClick} treeName={treeName} />
        <CmBeobNichtZuzuordnen onClick={handleClick} treeName={treeName} />
        <CmTpopfreiwkontrFolder onClick={handleClick} treeName={treeName} />
        <CmTpopfreiwkontr onClick={handleClick} treeName={treeName} />
        <CmTpopfreiwkontrzaehlFolder
          onClick={handleClick}
          treeName={treeName}
        />
        <CmTpopfreiwkontrzaehl onClick={handleClick} treeName={treeName} />
        <CmTpopfeldkontrFolder onClick={handleClick} treeName={treeName} />
        <CmTpopfeldkontr onClick={handleClick} treeName={treeName} />
        <CmTpopfeldkontrzaehlFolder onClick={handleClick} treeName={treeName} />
        <CmTpopfeldkontrzaehl onClick={handleClick} treeName={treeName} />
        <CmTpopmassnberFolder onClick={handleClick} treeName={treeName} />
        <CmTpopmassnber onClick={handleClick} treeName={treeName} />
        <CmTpopmassnFolder onClick={handleClick} treeName={treeName} />
        <CmTpopmassn onClick={handleClick} treeName={treeName} />
        <CmUserFolder onClick={handleClick} treeName={treeName} />
        <CmUser onClick={handleClick} treeName={treeName} />
        <CmAdresseFolder onClick={handleClick} treeName={treeName} />
        <CmAdresse onClick={handleClick} treeName={treeName} />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(TreeContainer)
