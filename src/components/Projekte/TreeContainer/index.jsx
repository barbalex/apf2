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

const LabelFilter = lazy(() => import('./LabelFilter'))
const ApFilter = lazy(() => import('./ApFilter'))
const TreeComponent = lazy(() => import('./Tree'))
const CmApFolder = lazy(() => import('./contextmenu/ApFolder'))
const CmAp = lazy(() => import('./contextmenu/Ap'))
const CmUserFolder = lazy(() => import('./contextmenu/UserFolder'))
const CmUser = lazy(() => import('./contextmenu/User'))
const CmAdresseFolder = lazy(() => import('./contextmenu/AdresseFolder'))
const CmAdresse = lazy(() => import('./contextmenu/Adresse'))
const CmTpopApberrelevantGrundWerteFolder = lazy(
  () => import('./contextmenu/TpopApberrelevantGrundWerteFolder'),
)
const CmTpopApberrelevantGrundWerte = lazy(
  () => import('./contextmenu/TpopApberrelevantGrundWerte'),
)
const CmTpopkontrzaehlEinheitWerteFolder = lazy(
  () => import('./contextmenu/TpopkontrzaehlEinheitWerteFolder'),
)
const CmTpopkontrzaehlEinheitWerte = lazy(
  () => import('./contextmenu/TpopkontrzaehlEinheitWerte'),
)
const CmEkAbrechnungstypWerteFolder = lazy(
  () => import('./contextmenu/EkAbrechnungstypWerteFolder'),
)
const CmEkAbrechnungstypWerte = lazy(
  () => import('./contextmenu/EkAbrechnungstypWerte'),
)
const CmApberuebersichtFolder = lazy(
  () => import('./contextmenu/ApberuebersichtFolder'),
)
const CmApberuebersicht = lazy(() => import('./contextmenu/Apberuebersicht'))
const CmAssozartFolder = lazy(() => import('./contextmenu/AssozartFolder'))
const CmAssozart = lazy(() => import('./contextmenu/Assozart'))
const CmEkzaehleinheitFolder = lazy(
  () => import('./contextmenu/EkzaehleinheitFolder'),
)
const CmEkzaehleinheit = lazy(() => import('./contextmenu/Ekzaehleinheit'))
const CmEkfrequenzFolder = lazy(() => import('./contextmenu/EkfrequenzFolder'))
const CmEkfrequenz = lazy(() => import('./contextmenu/Ekfrequenz'))
const CmApartFolder = lazy(() => import('./contextmenu/ApartFolder'))
const CmApart = lazy(() => import('./contextmenu/Apart'))
const CmBeobZugeordnetFolder = lazy(
  () => import('./contextmenu/BeobZugeordnetFolder'),
)
const CmApberFolder = lazy(() => import('./contextmenu/ApberFolder'))
const CmApber = lazy(() => import('./contextmenu/Apber'))
const CmErfkritFolder = lazy(() => import('./contextmenu/ErfkritFolder'))
const CmErfkrit = lazy(() => import('./contextmenu/Erfkrit'))
const CmZielFolder = lazy(() => import('./contextmenu/ZielFolder'))
const CmZielJahrFolder = lazy(() => import('./contextmenu/ZielJahrFolder'))
const CmZiel = lazy(() => import('./contextmenu/Ziel'))
const CmZielBerFolder = lazy(() => import('./contextmenu/ZielBerFolder'))
const CmZielBer = lazy(() => import('./contextmenu/Zielber'))
const CmPopFolder = lazy(() => import('./contextmenu/PopFolder'))
const CmPop = lazy(() => import('./contextmenu/Pop'))
const CmPopmassnberFolder = lazy(
  () => import('./contextmenu/PopmassnberFolder'),
)
const CmPopmassnber = lazy(() => import('./contextmenu/Popmassnber'))
const CmPopberFolder = lazy(() => import('./contextmenu/PopberFolder'))
const CmPopber = lazy(() => import('./contextmenu/Popber'))
const CmProjekt = lazy(() => import('./contextmenu/Projekt'))
const CmWerteListen = lazy(() => import('./contextmenu/WerteListen'))
const CmTpopFolder = lazy(() => import('./contextmenu/TpopFolder'))
const CmTpop = lazy(() => import('./contextmenu/Tpop'))
const CmTpopberFolder = lazy(() => import('./contextmenu/TpopberFolder'))
const CmTpopber = lazy(() => import('./contextmenu/Tpopber'))
const CmBeobZugeordnet = lazy(() => import('./contextmenu/BeobZugeordnet'))
const CmBeobnichtbeurteilt = lazy(
  () => import('./contextmenu/Beobnichtbeurteilt'),
)
const CmBeobNichtZuzuordnen = lazy(
  () => import('./contextmenu/BeobNichtZuzuordnen'),
)
const CmTpopfreiwkontrFolder = lazy(
  () => import('./contextmenu/TpopfreiwkontrFolder'),
)
const CmTpopfreiwkontr = lazy(() => import('./contextmenu/Tpopfreiwkontr'))
const CmTpopfeldkontrFolder = lazy(
  () => import('./contextmenu/TpopfeldkontrFolder'),
)
const CmTpopfeldkontr = lazy(() => import('./contextmenu/Tpopfeldkontr'))
const CmTpopfeldkontrzaehlFolder = lazy(
  () => import('./contextmenu/TpopfeldkontrzaehlFolder'),
)
const CmTpopfeldkontrzaehl = lazy(
  () => import('./contextmenu/Tpopfeldkontrzaehl'),
)
const CmTpopmassnberFolder = lazy(
  () => import('./contextmenu/TpopmassnberFolder'),
)
const CmTpopmassnber = lazy(() => import('./contextmenu/Tpopmassnber'))
const CmTpopmassnFolder = lazy(() => import('./contextmenu/TpopmassnFolder'))
const CmTpopmassn = lazy(() => import('./contextmenu/Tpopmassn'))
const DeleteDatasetModal = lazy(() => import('./DeleteDatasetModal'))
import copyBiotopTo from '../../../modules/copyBiotopTo'
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
import { StoreContext } from '../../../storeContext.js'
const TpopFromBeobPopList = lazy(() => import('./TpopFromBeobPopList'))
import ErrorBoundary from '../../shared/ErrorBoundary.jsx'
import useSearchParamsState from '../../../modules/useSearchParamsState.js'
import isMobilePhone from '../../../modules/isMobilePhone.js'
import Spinner from '../../shared/Spinner.jsx'

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

const TreeContainer = () => {
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
              <Button onClick={closeNewTpopFromBeobDialog} color="inherit">
                abbrechen
              </Button>
            </DialogActions>
          </StyledDialog>
        </Suspense>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(TreeContainer)
