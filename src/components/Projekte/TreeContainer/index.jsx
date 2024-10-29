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
const CmEkzaehleinheitFolder = lazy(
  () => import('./contextmenu/EkzaehleinheitFolder.jsx'),
)
const CmEkzaehleinheit = lazy(() => import('./contextmenu/Ekzaehleinheit.jsx'))
const CmEkfrequenzFolder = lazy(
  () => import('./contextmenu/EkfrequenzFolder.jsx'),
)
const CmEkfrequenz = lazy(() => import('./contextmenu/Ekfrequenz.jsx'))
const CmApartFolder = lazy(() => import('./contextmenu/ApartFolder.jsx'))
const CmApart = lazy(() => import('./contextmenu/Apart.jsx'))
const CmBeobZugeordnetFolder = lazy(
  () => import('./contextmenu/BeobZugeordnetFolder.jsx'),
)
const CmApberFolder = lazy(() => import('./contextmenu/ApberFolder.jsx'))
const CmApber = lazy(() => import('./contextmenu/Apber.jsx'))
const CmErfkritFolder = lazy(() => import('./contextmenu/ErfkritFolder.jsx'))
const CmErfkrit = lazy(() => import('./contextmenu/Erfkrit.jsx'))
const CmZielFolder = lazy(() => import('./contextmenu/ZielFolder.jsx'))
const CmZielJahrFolder = lazy(() => import('./contextmenu/ZielJahrFolder.jsx'))
const CmZiel = lazy(() => import('./contextmenu/Ziel.jsx'))
const CmZielBerFolder = lazy(() => import('./contextmenu/ZielBerFolder.jsx'))
const CmZielBer = lazy(() => import('./contextmenu/Zielber.jsx'))
const CmPopFolder = lazy(() => import('./contextmenu/PopFolder.jsx'))
const CmPop = lazy(() => import('./contextmenu/Pop.jsx'))
const CmPopmassnberFolder = lazy(
  () => import('./contextmenu/PopmassnberFolder.jsx'),
)
const CmPopmassnber = lazy(() => import('./contextmenu/Popmassnber.jsx'))
const CmPopberFolder = lazy(() => import('./contextmenu/PopberFolder.jsx'))
const CmPopber = lazy(() => import('./contextmenu/Popber.jsx'))
const CmProjekt = lazy(() => import('./contextmenu/Projekt.jsx'))
const CmWerteListen = lazy(() => import('./contextmenu/WerteListen.jsx'))
const CmTpopFolder = lazy(() => import('./contextmenu/TpopFolder.jsx'))
const CmTpop = lazy(() => import('./contextmenu/Tpop.jsx'))
const CmTpopberFolder = lazy(() => import('./contextmenu/TpopberFolder.jsx'))
const CmTpopber = lazy(() => import('./contextmenu/Tpopber.jsx'))
const CmBeobZugeordnet = lazy(() => import('./contextmenu/BeobZugeordnet.jsx'))
const CmBeobnichtbeurteilt = lazy(
  () => import('./contextmenu/Beobnichtbeurteilt.jsx'),
)
const CmBeobNichtZuzuordnen = lazy(
  () => import('./contextmenu/BeobNichtZuzuordnen.jsx'),
)
const CmTpopfreiwkontrFolder = lazy(
  () => import('./contextmenu/TpopfreiwkontrFolder.jsx'),
)
const CmTpopfreiwkontr = lazy(() => import('./contextmenu/Tpopfreiwkontr.jsx'))
const CmTpopfeldkontrFolder = lazy(
  () => import('./contextmenu/TpopfeldkontrFolder.jsx'),
)
const CmTpopfeldkontr = lazy(() => import('./contextmenu/Tpopfeldkontr.jsx'))
const CmTpopfeldkontrzaehlFolder = lazy(
  () => import('./contextmenu/TpopfeldkontrzaehlFolder.jsx'),
)
const CmTpopfeldkontrzaehl = lazy(
  () => import('./contextmenu/Tpopfeldkontrzaehl.jsx'),
)
const CmTpopmassnberFolder = lazy(
  () => import('./contextmenu/TpopmassnberFolder.jsx'),
)
const CmTpopmassnber = lazy(() => import('./contextmenu/Tpopmassnber.jsx'))
const CmTpopmassnFolder = lazy(
  () => import('./contextmenu/TpopmassnFolder.jsx'),
)
const CmTpopmassn = lazy(() => import('./contextmenu/Tpopmassn.jsx'))
const DeleteDatasetModal = lazy(() => import('./DeleteDatasetModal/index.jsx'))
import { copyBiotopTo } from '../../../modules/copyBiotopTo.js'
import { moveTo } from '../../../modules/moveTo/index.js'
import { copyTo } from '../../../modules/copyTo/index.js'
import createNewPopFromBeob from '../../../modules/createNewPopFromBeob/index.js'
import { copyBeobZugeordnetKoordToTpop } from '../../../modules/copyBeobZugeordnetKoordToTpop/index.js'
import copyTpopKoordToPop from '../../../modules/copyTpopKoordToPop/index.js'
import tpopById from './tpopById.js'
import beobById from './beobById.js'
import openLowerNodes from './openLowerNodes/index.js'
import closeLowerNodes from './closeLowerNodes.js'
import insertDataset from './insertDataset.js'
import { StoreContext } from '../../../storeContext.js'
const TpopFromBeobPopList = lazy(() => import('./TpopFromBeobPopList.jsx'))
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { useSearchParamsState } from '../../../modules/useSearchParamsState.js'
import { isMobilePhone } from '../../../modules/isMobilePhone.js'
import { Spinner } from '../../shared/Spinner.jsx'

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

const getAndValidateCoordinatesOfBeob = async ({
  id,
  enqueNotification,
  client,
}) => {
  let beobResult
  try {
    beobResult = await client.query({
      query: beobById,
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
  const beob = beobResult?.data?.beobById
  const { lv95X, lv95Y } = beob
  if (!lv95X) {
    enqueNotification({
      message: `Die Teilpopulation mit der ID ${id} kat keine (vollständigen) Koordinaten`,
      options: {
        variant: 'error',
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
  const queryClient = useQueryClient()

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

  const [newTpopFromBeobDialogOpen, setNewTpopFromBeobDialogOpen] =
    useState(false)
  const [newTpopFromBeobBeobId, setNewTpopFromBeobBeobId] = useState(null)
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
              queryClient.invalidateQueries({
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
            queryClient,
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
          const { lv95X, lv95Y } = await getAndValidateCoordinatesOfBeob({
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
        async showCoordOfBeobOnMapGeoAdminCh() {
          const { lv95X, lv95Y } = await getAndValidateCoordinatesOfBeob({
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
      queryClient,
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
