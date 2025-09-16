import { memo, useCallback, useContext, lazy, Suspense } from 'react'
import styled from '@emotion/styled'
import uniq from 'lodash/uniq'
import { isEqual } from 'es-toolkit'
import { upperFirst } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from "@apollo/client/react";
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { useParams, useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { getSnapshot } from 'mobx-state-tree'

import { useAtom } from 'jotai'
import {
  newTpopFromBeobDialogOpenAtom,
  newTpopFromBeobBeobIdAtom,
} from '../../../JotaiStore/index.js'

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
const TpopFromBeobPopList = lazy(async () => ({
  default: (await import('./TpopFromBeobPopList.jsx')).TpopFromBeobPopList,
}))
const ErrorBoundary = lazy(async () => ({
  default: (await import('../../shared/ErrorBoundary.jsx')).ErrorBoundary,
}))

import { copyBiotopTo } from '../../../modules/copyBiotopTo.js'
import { moveTo } from '../../../modules/moveTo/index.js'
import { copyTo } from '../../../modules/copyTo/index.js'
import { createNewPopFromBeob } from '../../../modules/createNewPopFromBeob/index.js'
import { copyBeobZugeordnetKoordToTpop } from '../../../modules/copyBeobZugeordnetKoordToTpop/index.js'
import { copyTpopKoordToPop } from '../../../modules/copyTpopKoordToPop/index.js'
import { openLowerNodes } from './openLowerNodes/index.js'
import { closeLowerNodes } from './closeLowerNodes.js'
import { insertDataset } from './insertDataset.js'
import { MobxContext } from '../../../mobxContext.js'
import { useProjekteTabs } from '../../../modules/useProjekteTabs.js'
import { showCoordOfBeobOnMapsZhCh } from '../../../modules/showCoordOfBeobOnMapsZhCh.js'
import { showCoordOfBeobOnMapGeoAdminCh } from '../../../modules/showCoordOfBeobOnMapGeoAdminCh.js'
import { getAndValidateCoordinatesOfTpop } from '../../../modules/getAndValidateCoordinatesOfTpop.js'
import { showCoordOfTpopOnMapsZhCh } from '../../../modules/showCoordOfTpopOnMapsZhCh.js'
import { showCoordOfTpopOnMapGeoAdminCh } from '../../../modules/showCoordOfTpopOnMapGeoAdminCh.js'

const Container = styled.div`
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
const StyledDialog = styled(Dialog)`
  /*overflow-y: hidden;*/
  .MuiDialog-paper {
    overflow-y: hidden;
  }
`

export const Menus = memo(
  observer(() => {
    const params = useParams()
    const { projId, apId, popId } = params
    const { search } = useLocation()

    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()

    const store = useContext(MobxContext)
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

    const [projekteTabs, setProjekteTabs] = useProjekteTabs()
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
        const singleElementName = firstElementChild.getAttribute(
          'data-singleelementname',
        )
        const jahr = firstElementChild.getAttribute('data-jahr')
        // console.log('TreeContainer.Menus.handleClick', {
        //   table,
        //   action,
        //   actionTable,
        //   firstElementChild,
        //   id,
        //   parentId,
        //   urlPassed,
        //   url,
        //   label,
        //   nodeType,
        //   menuType,
        //   singleElementName,
        //   jahr,
        // })
        const actions = {
          insert() {
            const urlForInsert = [...url]
            // when inserting on same level, remove last url element
            if (nodeType === 'table') {
              urlForInsert.pop()
            }
            if (menuType === 'zielFolder') {
              // db sets year 1 as standard
              urlForInsert.push(1)
            }
            insertDataset({
              tablePassed: table,
              parentId: parentId || id,
              url: urlForInsert,
              menuType,
              singleElementName,
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
                tanstackQueryClient.invalidateQueries({
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
            setMoving({
              table,
              id,
              label,
              toTable: actionTable,
              fromParentId: apId,
            })
          },
          move() {
            moveTo({
              id: nodeType === 'folder' ? parentId : id,
              store,
              client,
              tanstackQueryClient,
            })
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
              id: '99999999-9999-9999-9999-999999999999',
              label: null,
              withNextLevel: false,
            })
          },
          copy() {
            // console.log('TreeContainer.Menus.handleClick.copy', {
            //   id,
            //   parentId,
            // })
            copyTo({
              parentId: nodeType === 'folder' ? parentId : id,
              client,
              store,
              tanstackQueryClient,
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
              tanstakQueryClient: tanstackQueryClient,
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
            showCoordOfTpopOnMapsZhCh({ id, enqueNotification, client })
          },
          async showCoordOfTpopOnMapGeoAdminCh() {
            showCoordOfTpopOnMapGeoAdminCh({
              id,
              enqueNotification,
              client,
            })
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
        tanstackQueryClient,
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

    return (
      <ErrorBoundary>
        <Container>
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
  }),
)
