/**
 * need to keep class because of ref
 */
import { useCallback, useContext, useState, lazy, Suspense } from 'react'
import styled from '@emotion/styled'
import uniq from 'lodash/uniq'
import isEqual from 'lodash/isEqual'
import upperFirst from 'lodash/upperFirst'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { useParams, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { getSnapshot } from 'mobx-state-tree'

import { useSetAtom, useAtom } from 'jotai'
import {
  newTpopFromBeobDialogOpenAtom,
  newTpopFromBeobBeobIdAtom,
} from '../../../JotaiStore/index.js'

const LabelFilter = lazy(async () => ({
  default: (await import('./LabelFilter.jsx')).LabelFilter,
}))
const ApFilter = lazy(async () => ({
  default: (await import('./ApFilter/index.jsx')).ApFilter,
}))
const TreeComponent = lazy(async () => ({
  default: (await import('./Tree/index.jsx')).TreeComponent,
}))
const CmApFolder = lazy(async () => ({
  default: (await import('./contextmenu/ApFolder.jsx')).Apfolder,
}))
const CmAp = lazy(async () => ({
  default: (await import('./contextmenu/Ap.jsx')).Ap,
}))
const CmUserFolder = lazy(async () => ({
  default: (await import('./contextmenu/UserFolder.jsx')).UserFolder,
}))
const CmUser = lazy(async () => ({
  default: (await import('./contextmenu/User.jsx')).User,
}))
const CmAdresseFolder = lazy(async () => ({
  default: (await import('./contextmenu/AdresseFolder.jsx')).Adressefolder,
}))
const CmAdresse = lazy(async () => ({
  default: (await import('./contextmenu/Adresse.jsx')).Adresse,
}))
const CmTpopApberrelevantGrundWerteFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopApberrelevantGrundWerteFolder.jsx'))
    .TpopApberrelevantGrundWerteFolder,
}))
const CmTpopApberrelevantGrundWerte = lazy(async () => ({
  default: (await import('./contextmenu/TpopApberrelevantGrundWerte.jsx'))
    .TpopApberrelevantGrundWerte,
}))
const CmTpopkontrzaehlEinheitWerteFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopkontrzaehlEinheitWerteFolder.jsx'))
    .TpopkontrzaehlEinheitWerteFolder,
}))
const CmTpopkontrzaehlEinheitWerte = lazy(async () => ({
  default: (await import('./contextmenu/TpopkontrzaehlEinheitWerte.jsx'))
    .TpopkontrzaehlEinheitWerte,
}))
const CmEkAbrechnungstypWerteFolder = lazy(async () => ({
  default: (await import('./contextmenu/EkAbrechnungstypWerteFolder.jsx'))
    .EkAbrechnungstypWerteFolder,
}))
const CmEkAbrechnungstypWerte = lazy(async () => ({
  default: (await import('./contextmenu/EkAbrechnungstypWerte.jsx'))
    .EkAbrechnungstypWerte,
}))
const CmApberuebersichtFolder = lazy(async () => ({
  default: (await import('./contextmenu/ApberuebersichtFolder.jsx'))
    .ApberuebersichtFolder,
}))
const CmApberuebersicht = lazy(async () => ({
  default: (await import('./contextmenu/Apberuebersicht.jsx')).Apberuebersicht,
}))
const CmAssozartFolder = lazy(async () => ({
  default: (await import('./contextmenu/AssozartFolder.jsx')).AssozartFolder,
}))
const CmAssozart = lazy(async () => ({
  default: (await import('./contextmenu/Assozart.jsx')).AssozartFolder,
}))
const CmEkzaehleinheitFolder = lazy(async () => ({
  default: (await import('./contextmenu/EkzaehleinheitFolder.jsx'))
    .EkzaehleinheitFolder,
}))
const CmEkzaehleinheit = lazy(async () => ({
  default: (await import('./contextmenu/Ekzaehleinheit.jsx')).Ekzaehleinheit,
}))
const CmEkfrequenzFolder = lazy(async () => ({
  default: (await import('./contextmenu/EkfrequenzFolder.jsx'))
    .EkfrequenzFolder,
}))
const CmEkfrequenz = lazy(async () => ({
  default: (await import('./contextmenu/Ekfrequenz.jsx')).Ekfrequenz,
}))
const CmApartFolder = lazy(async () => ({
  default: (await import('./contextmenu/ApartFolder.jsx')).ApartFolder,
}))
const CmApart = lazy(async () => ({
  default: (await import('./contextmenu/Apart.jsx')).Apart,
}))
const CmBeobZugeordnetFolder = lazy(async () => ({
  default: (await import('./contextmenu/BeobZugeordnetFolder.jsx'))
    .BeobZugeordnetFolder,
}))
const CmApberFolder = lazy(async () => ({
  default: (await import('./contextmenu/ApberFolder.jsx')).ApberFolder,
}))
const CmApber = lazy(async () => ({
  default: (await import('./contextmenu/Apber.jsx')).Apber,
}))
const CmErfkritFolder = lazy(async () => ({
  default: (await import('./contextmenu/ErfkritFolder.jsx')).ErfkritFolder,
}))
const CmErfkrit = lazy(async () => ({
  default: (await import('./contextmenu/Erfkrit.jsx')).Erfkrit,
}))
const CmZielFolder = lazy(async () => ({
  default: (await import('./contextmenu/ZielFolder.jsx')).ZielFolder,
}))
const CmZielJahrFolder = lazy(async () => ({
  default: (await import('./contextmenu/ZielJahrFolder.jsx')).ZielJahrFolder,
}))
const CmZiel = lazy(async () => ({
  default: (await import('./contextmenu/Ziel.jsx')).Ziel,
}))
const CmZielBerFolder = lazy(async () => ({
  default: (await import('./contextmenu/ZielBerFolder.jsx')).ZielBerFolder,
}))
const CmZielBer = lazy(async () => ({
  default: (await import('./contextmenu/Zielber.jsx')).Zielber,
}))
const CmPopFolder = lazy(async () => ({
  default: (await import('./contextmenu/PopFolder.jsx')).PopFolder,
}))
const CmPop = lazy(async () => ({
  default: (await import('./contextmenu/Pop.jsx')).Pop,
}))
const CmPopmassnberFolder = lazy(async () => ({
  default: (await import('./contextmenu/PopmassnberFolder.jsx'))
    .PopmassnberFolder,
}))
const CmPopmassnber = lazy(async () => ({
  default: (await import('./contextmenu/Popmassnber.jsx')).Popmassnber,
}))
const CmPopberFolder = lazy(async () => ({
  default: (await import('./contextmenu/PopberFolder.jsx')).PopberFolder,
}))
const CmPopber = lazy(async () => ({
  default: (await import('./contextmenu/Popber.jsx')).Popber,
}))
const CmProjekt = lazy(async () => ({
  default: (await import('./contextmenu/Projekt.jsx')).Projekt,
}))
const CmWerteListen = lazy(async () => ({
  default: (await import('./contextmenu/WerteListen.jsx')).WerteListen,
}))
const CmTpopFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopFolder.jsx')).TpopFolder,
}))
const CmTpop = lazy(async () => ({
  default: (await import('./contextmenu/Tpop.jsx')).Tpop,
}))
const CmTpopberFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopberFolder.jsx')).TpopberFolder,
}))
const CmTpopber = lazy(async () => ({
  default: (await import('./contextmenu/Tpopber.jsx')).Tpopber,
}))
const CmBeobZugeordnet = lazy(async () => ({
  default: (await import('./contextmenu/BeobZugeordnet.jsx')).BeobZugeordnet,
}))
const CmBeobnichtbeurteilt = lazy(async () => ({
  default: (await import('./contextmenu/Beobnichtbeurteilt.jsx'))
    .BeobNichtBeurteilt,
}))
const CmBeobNichtZuzuordnen = lazy(async () => ({
  default: (await import('./contextmenu/BeobNichtZuzuordnen.jsx'))
    .BeobNichtZuzuordnen,
}))
const CmTpopfreiwkontrFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopfreiwkontrFolder.jsx'))
    .TpopfreiwkontrFolder,
}))
const CmTpopfreiwkontr = lazy(async () => ({
  default: (await import('./contextmenu/Tpopfreiwkontr.jsx')).Tpopfreiwkontr,
}))
const CmTpopfeldkontrFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopfeldkontrFolder.jsx'))
    .TpopfeldkontrFolder,
}))
const CmTpopfeldkontr = lazy(async () => ({
  default: (await import('./contextmenu/Tpopfeldkontr.jsx')).Tpopfeldkontr,
}))
const CmTpopfeldkontrzaehlFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopfeldkontrzaehlFolder.jsx'))
    .TpopfeldkontrzaehlFolder,
}))
const CmTpopfeldkontrzaehl = lazy(async () => ({
  default: (await import('./contextmenu/Tpopfeldkontrzaehl.jsx'))
    .Tpopfeldkontrzaehl,
}))
const CmTpopmassnberFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopmassnberFolder.jsx'))
    .TpopmassnberFolder,
}))
const CmTpopmassnber = lazy(async () => ({
  default: (await import('./contextmenu/Tpopmassnber.jsx')).Tpopmassnber,
}))
const CmTpopmassnFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopmassnFolder.jsx')).TpopmassnFolder,
}))
const CmTpopmassn = lazy(async () => ({
  default: (await import('./contextmenu/Tpopmassn.jsx')).Tpopmassn,
}))
const DeleteDatasetModal = lazy(async () => ({
  default: (await import('./DeleteDatasetModal/index.jsx')).DatasetDeleteModal,
}))
const TpopFromBeobPopList = lazy(async () => ({
  default: (await import('./TpopFromBeobPopList.jsx')).TpopFromBeobPopList,
}))
const ErrorBoundary = lazy(async () => ({
  default: (await import('../../shared/ErrorBoundary.jsx')).ErrorBoundary,
}))
const Spinner = lazy(async () => ({
  default: (await import('../../shared/Spinner.jsx')).Spinner,
}))

import { copyBiotopTo } from '../../../modules/copyBiotopTo.js'
import { moveTo } from '../../../modules/moveTo/index.js'
import { copyTo } from '../../../modules/copyTo/index.js'
import { createNewPopFromBeob } from '../../../modules/createNewPopFromBeob/index.js'
import { copyBeobZugeordnetKoordToTpop } from '../../../modules/copyBeobZugeordnetKoordToTpop/index.js'
import { copyTpopKoordToPop } from '../../../modules/copyTpopKoordToPop/index.js'
import { tpopById } from './tpopById.js'
import { openLowerNodes } from './openLowerNodes/index.js'
import { closeLowerNodes } from './closeLowerNodes.js'
import { insertDataset } from './insertDataset.js'
import { StoreContext } from '../../../storeContext.js'
import { useSearchParamsState } from '../../../modules/useSearchParamsState.js'
import { isMobilePhone } from '../../../modules/isMobilePhone.js'
import { showCoordOfBeobOnMapsZhCh } from '../../../modules/showCoordOfBeobOnMapsZhCh.js'
import { showCoordOfBeobOnMapGeoAdminCh } from '../../../modules/showCoordOfBeobOnMapGeoAdminCh.js'

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

  .react-contextmenu {
    display: flex;
    flex-direction: column;
    min-width: 100px;
    padding: 5px 0;
    margin: -1px;
    font-size: 14px;
    text-align: left;
    background-color: rgb(66, 66, 66);
    background-clip: padding-box;
    border: 1px solid grey;
    border-radius: 0.25rem;
    outline: none;
    opacity: 0;
    pointer-events: none;
    font-family: 'Roboto', sans-serif;
  }

  .react-contextmenu.react-contextmenu--visible {
    color: white;
    opacity: 1;
    pointer-events: auto;
    z-index: 1000;
  }

  .react-contextmenu-title {
    opacity: 0;
  }

  .react-contextmenu--visible .react-contextmenu-title {
    color: #b3b3b3;
    padding-left: 10px;
    padding-right: 15px;
    padding-bottom: 3px;
    opacity: 1;
  }

  .react-contextmenu-title::after {
    content: ':';
  }

  .react-contextmenu > .react-contextmenu-item {
    display: inline-block;
    padding: 3px 20px;
    clear: both;
    font-weight: 400;
    line-height: 1.5;
    color: white;
    text-align: inherit;
    white-space: nowrap;
    background: 0 0;
    border: 0;
    text-decoration: none;
    cursor: pointer;
  }

  .react-contextmenu-item.active,
  .react-contextmenu-item:hover {
    color: #f57c00;
    border-color: #0275d8;
    text-decoration: none;
  }

  .react-contextmenu-divider {
    border-top: 1px solid grey;
    margin-top: 4px;
    margin-bottom: 7px;
  }

  .react-contextmenu-submenu {
    padding-right: 27px !important;
  }

  .react-contextmenu-submenu:after {
    content: '▶';
    display: inline-block;
    position: absolute;
    right: 7px;
    bottom: 3px;
  }
`
const LabelFilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 12px;
  padding-top: 5px;
  margin-bottom: 8px;
`
const StyledDialog = styled(Dialog)`
  /*overflow-y: hidden;*/
  .MuiDialog-paper {
    overflow-y: hidden;
  }
`

const getAndValidateCoordinatesOfTpop = async ({
  id,
  enqueNotification,
  client,
}) => {
  let tpopResult
  try {
    tpopResult = await client.query({
      query: tpopById,
      variables: { id },
    })
  } catch (error) {
    enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const tpop = tpopResult?.data?.tpopById
  const { lv95X, lv95Y } = tpop
  if (!lv95X) {
    enqueNotification({
      message: `Die Teilpopulation mit der ID ${id} kat keine (vollständigen) Koordinaten`,
      options: {
        variant: 'warning',
      },
    })
    return { lv95X: null, lv95Y: null }
  }
  return { lv95X, lv95Y }
}

export const TreeContainer = observer(() => {
  const params = useParams()
  const { apId, projId, popId } = params
  const { search } = useLocation()

  const client = useApolloClient()
  const tanstakQueryClient = useQueryClient()

  const store = useContext(StoreContext)
  const {
    activeApfloraLayers,
    setActiveApfloraLayers,
    setIdOfTpopBeingLocalized,
    enqueNotification,
    toDeleteId,
    setToDelete,
    setCopying,
    setMoving,
    copyingBiotop,
    setCopyingBiotop,
  } = store
  const { setOpenNodes, openNodes: openNodesRaw } = store.tree
  const openNodes = getSnapshot(openNodesRaw)

  // deactivated because toggling the project node would not close the project
  // useEffect(() => {
  //   // open single projects
  //   // dont do this in render!
  //   const projekteNodes = treeNodes.filter((n) => n.menuType === 'projekt')
  //   const existsOnlyOneProjekt = projekteNodes.length === 1
  //   const projektNode = projekteNodes[0]
  //   if (
  //     pathname.startsWith('/Daten/Projekte') &&
  //     !projId &&
  //     existsOnlyOneProjekt &&
  //     projektNode
  //   ) {
  //     const projektUrl = [...projektNode.url]
  //     navigate(`/Daten/${projektUrl.join('/')}${search}`)
  //     // add projekt to open nodes
  //     setOpenNodes([...openNodes, projektUrl])
  //   }
  // }, [treeNodes, openNodes, projId, setOpenNodes, navigate, search, pathname])

  const [newTpopFromBeobDialogOpen, setNewTpopFromBeobDialogOpen] = useAtom(
    newTpopFromBeobDialogOpenAtom,
  )
  const [newTpopFromBeobBeobId, setNewTpopFromBeobBeobId] = useAtom(
    newTpopFromBeobBeobIdAtom,
  )
  const closeNewTpopFromBeobDialog = useCallback(
    () => setNewTpopFromBeobDialogOpen(false),
    [],
  )

  const [projekteTabs, setProjekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )
  const showMapIfNotYetVisible = useCallback(
    (projekteTabs) => {
      const isVisible = projekteTabs.includes('karte')
      if (!isVisible) {
        setProjekteTabs([...projekteTabs, 'karte'])
      }
    },
    [setProjekteTabs],
  )
  const handleClick = useCallback(
    (e, data, element) => {
      // console.log('TreeContainer, handleClick', { e, data, element })
      if (!data) {
        return enqueNotification({
          message: 'no data passed with click',
          options: {
            variant: 'error',
          },
        })
      }
      if (!element) {
        return enqueNotification({
          message: 'no element passed with click',
          options: {
            variant: 'error',
          },
        })
      }
      const { table, action, actionTable } = data
      const { firstElementChild } = element
      if (!firstElementChild) {
        return enqueNotification({
          message: 'no firstElementChild passed with click',
          options: {
            variant: 'error',
          },
        })
      }
      const id = firstElementChild.getAttribute('data-id')
      const parentId = firstElementChild.getAttribute('data-parentid')
      const urlPassed = firstElementChild.getAttribute('data-url')
      const url = JSON.parse(urlPassed)
      const label = firstElementChild.getAttribute('data-label')
      const nodeType = firstElementChild.getAttribute('data-nodetype')
      const menuType = firstElementChild.getAttribute('data-menutype')
      const jahr = firstElementChild.getAttribute('data-jahr')
      const actions = {
        insert() {
          if (nodeType === 'table') {
            url.pop()
          }
          if (menuType === 'zielFolder') {
            // db sets year 1 as standard
            url.push(1)
          }
          insertDataset({
            tablePassed: table,
            parentId: parentId || id,
            url,
            menuType,
            id,
            client,
            store,
            search,
            jahr,
          })
        },
        openLowerNodes() {
          openLowerNodes({
            id,
            parentId,
            apId,
            projId,
            popId,
            menuType,
            client,
            store,
            jahr,
          })
        },
        closeLowerNodes() {
          closeLowerNodes({
            url,
            store,
            search,
          })
        },
        delete() {
          setToDelete({
            table,
            id,
            label,
            url,
            afterDeletionHook: () => {
              const newOpenNodes = openNodes.filter((n) => !isEqual(n, url))
              setOpenNodes(newOpenNodes)
              tanstakQueryClient.invalidateQueries({
                queryKey: [`tree${upperFirst(table)}`],
              })
            },
          })
        },
        showBeobOnMap() {
          // 1. open map if not yet open
          showMapIfNotYetVisible(projekteTabs)
          // 2 add layer for actionTable
          if (activeApfloraLayers.includes(actionTable)) {
            setActiveApfloraLayers(
              activeApfloraLayers.filter((o) => o !== actionTable),
            )
          } else {
            setActiveApfloraLayers([...activeApfloraLayers, actionTable])
          }
        },
        localizeOnMap() {
          setIdOfTpopBeingLocalized(id)
          showMapIfNotYetVisible(projekteTabs)
          setActiveApfloraLayers(uniq([...activeApfloraLayers, 'tpop']))
        },
        markForMoving() {
          setMoving({ table, id, label })
        },
        move() {
          moveTo({ id, store, client })
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
            store,
            queryClient: tanstakQueryClient,
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
          copyTpopKoordToPop({ id, store, client })
        },
        createNewPopFromBeob() {
          createNewPopFromBeob({
            id,
            apId,
            projId,
            client,
            store,
            search,
            tanstakQueryClient,
          })
        },
        createNewTpopFromBeob() {
          setNewTpopFromBeobBeobId(id)
          setNewTpopFromBeobDialogOpen(true)
        },
        copyBeobZugeordnetKoordToTpop() {
          copyBeobZugeordnetKoordToTpop({ id, store, client })
        },
        async showCoordOfTpopOnMapsZhCh() {
          const { lv95X, lv95Y } = await getAndValidateCoordinatesOfTpop({
            id,
            enqueNotification,
            client,
          })
          if (lv95X && lv95Y) {
            window.open(
              `https://maps.zh.ch/?x=${lv95X}&y=${lv95Y}&scale=3000&markers=ring`,
              'target="_blank"',
            )
          }
        },
        async showCoordOfTpopOnMapGeoAdminCh() {
          const { lv95X, lv95Y } = await getAndValidateCoordinatesOfTpop({
            id,
            enqueNotification,
            client,
          })
          if (lv95X && lv95Y) {
            window.open(
              `https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-farbe&Y=${lv95X}&X=${lv95Y}&zoom=10&crosshair=circle`,
              'target="_blank"',
            )
          }
        },
        async showCoordOfBeobOnMapsZhCh() {
          showCoordOfBeobOnMapsZhCh({ id, enqueNotification, client })
        },
        async showCoordOfBeobOnMapGeoAdminCh() {
          showCoordOfBeobOnMapGeoAdminCh({ id, enqueNotification, client })
        },
      }
      if (Object.keys(actions).includes(action)) {
        actions[action]()
      } else {
        enqueNotification({
          message: `action "${action}" unknown, therefore not executed`,
          options: {
            variant: 'error',
          },
        })
      }
    },
    [
      enqueNotification,
      client,
      store,
      search,
      apId,
      projId,
      popId,
      setToDelete,
      openNodes,
      setOpenNodes,
      tanstakQueryClient,
      showMapIfNotYetVisible,
      projekteTabs,
      activeApfloraLayers,
      setActiveApfloraLayers,
      setIdOfTpopBeingLocalized,
      setMoving,
      setCopying,
      setCopyingBiotop,
      copyingBiotop,
    ],
  )

  //console.log('TreeContainer',{data})
  // console.log('TreeContainer rendering')

  return (
    <ErrorBoundary>
      <Container data-id="tree-container1">
        {!!toDeleteId && (
          <Suspense fallback={null}>
            <DeleteDatasetModal />
          </Suspense>
        )}
        <LabelFilterContainer>
          <Suspense fallback={null}>
            <LabelFilter />
          </Suspense>
          {!!projId && (
            <Suspense fallback={null}>
              <ApFilter />
            </Suspense>
          )}
        </LabelFilterContainer>
        <Suspense fallback={<Spinner />}>
          <TreeComponent />
        </Suspense>
        <Suspense fallback={null}>
          <CmApFolder onClick={handleClick} />
          <CmAp onClick={handleClick} />
          <CmApberuebersichtFolder onClick={handleClick} />
          <CmApberuebersicht onClick={handleClick} />
          <CmAssozartFolder onClick={handleClick} />
          <CmAssozart onClick={handleClick} />
          <CmEkzaehleinheitFolder onClick={handleClick} />
          <CmEkzaehleinheit onClick={handleClick} />
          <CmEkfrequenzFolder onClick={handleClick} />
          <CmEkfrequenz onClick={handleClick} />
          <CmApartFolder onClick={handleClick} />
          <CmApart onClick={handleClick} />
          <CmBeobZugeordnetFolder onClick={handleClick} />
          <CmApberFolder onClick={handleClick} />
          <CmApber onClick={handleClick} />
          <CmErfkritFolder onClick={handleClick} />
          <CmErfkrit onClick={handleClick} />
          <CmZielFolder onClick={handleClick} />
          <CmZielJahrFolder onClick={handleClick} />
          <CmZiel onClick={handleClick} />
          <CmZielBerFolder onClick={handleClick} />
          <CmZielBer onClick={handleClick} />
          <CmPopFolder onClick={handleClick} />
          <CmPop onClick={handleClick} />
          <CmPopmassnberFolder onClick={handleClick} />
          <CmPopmassnber onClick={handleClick} />
          <CmPopberFolder onClick={handleClick} />
          <CmPopber onClick={handleClick} />
          <CmProjekt onClick={handleClick} />
          <CmWerteListen onClick={handleClick} />
          <CmTpopFolder onClick={handleClick} />
          <CmTpop onClick={handleClick} />
          <CmTpopberFolder onClick={handleClick} />
          <CmTpopber onClick={handleClick} />
          <CmBeobZugeordnet onClick={handleClick} />
          <CmBeobnichtbeurteilt onClick={handleClick} />
          <CmBeobNichtZuzuordnen onClick={handleClick} />
          <CmTpopfreiwkontrFolder onClick={handleClick} />
          <CmTpopfreiwkontr onClick={handleClick} />
          <CmTpopfeldkontrFolder onClick={handleClick} />
          <CmTpopfeldkontr onClick={handleClick} />
          <CmTpopfeldkontrzaehlFolder onClick={handleClick} />
          <CmTpopfeldkontrzaehl onClick={handleClick} />
          <CmTpopmassnberFolder onClick={handleClick} />
          <CmTpopmassnber onClick={handleClick} />
          <CmTpopmassnFolder onClick={handleClick} />
          <CmTpopmassn onClick={handleClick} />
          <CmUserFolder onClick={handleClick} />
          <CmUser onClick={handleClick} />
          <CmAdresseFolder onClick={handleClick} />
          <CmTpopApberrelevantGrundWerteFolder onClick={handleClick} />
          <CmEkAbrechnungstypWerteFolder onClick={handleClick} />
          <CmEkAbrechnungstypWerte onClick={handleClick} />
          <CmTpopkontrzaehlEinheitWerteFolder onClick={handleClick} />
          <CmTpopkontrzaehlEinheitWerte onClick={handleClick} />
          <CmAdresse onClick={handleClick} />
          <CmTpopApberrelevantGrundWerte onClick={handleClick} />
          <StyledDialog
            open={newTpopFromBeobDialogOpen}
            onClose={closeNewTpopFromBeobDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xl"
          >
            <DialogTitle id="alert-dialog-title">
              {'Population wählen:'}
            </DialogTitle>
            <DialogContent dividers={false}>
              <TpopFromBeobPopList
                beobId={newTpopFromBeobBeobId}
                closeNewTpopFromBeobDialog={closeNewTpopFromBeobDialog}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={closeNewTpopFromBeobDialog}
                color="inherit"
              >
                abbrechen
              </Button>
            </DialogActions>
          </StyledDialog>
        </Suspense>
      </Container>
    </ErrorBoundary>
  )
})
