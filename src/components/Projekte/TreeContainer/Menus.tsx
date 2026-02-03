import { lazy, Suspense } from 'react'
import { uniq } from 'es-toolkit'
import { isEqual } from 'es-toolkit'
import { upperFirst } from 'es-toolkit'
import { useApolloClient } from '@apollo/client/react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { useParams, useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { useSetAtom, useAtomValue, useAtom } from 'jotai'
import {
  newTpopFromBeobDialogOpenAtom,
  newTpopFromBeobBeobIdAtom,
  addNotificationAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../store/index.ts'

const CmApFolder = lazy(async () => ({
  default: (await import('./contextmenu/ApFolder.tsx')).Apfolder,
}))
const CmAp = lazy(async () => ({
  default: (await import('./contextmenu/Ap.tsx')).Ap,
}))
const CmUserFolder = lazy(async () => ({
  default: (await import('./contextmenu/UserFolder.tsx')).UserFolder,
}))
const CmUser = lazy(async () => ({
  default: (await import('./contextmenu/User.tsx')).User,
}))
const CmAdresseFolder = lazy(async () => ({
  default: (await import('./contextmenu/AdresseFolder.tsx')).Adressefolder,
}))
const CmAdresse = lazy(async () => ({
  default: (await import('./contextmenu/Adresse.tsx')).Adresse,
}))
const CmTpopApberrelevantGrundWerteFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopApberrelevantGrundWerteFolder.tsx'))
    .TpopApberrelevantGrundWerteFolder,
}))
const CmTpopApberrelevantGrundWerte = lazy(async () => ({
  default: (await import('./contextmenu/TpopApberrelevantGrundWerte.tsx'))
    .TpopApberrelevantGrundWerte,
}))
const CmTpopkontrzaehlEinheitWerteFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopkontrzaehlEinheitWerteFolder.tsx'))
    .TpopkontrzaehlEinheitWerteFolder,
}))
const CmTpopkontrzaehlEinheitWerte = lazy(async () => ({
  default: (await import('./contextmenu/TpopkontrzaehlEinheitWerte.tsx'))
    .TpopkontrzaehlEinheitWerte,
}))
const CmEkAbrechnungstypWerteFolder = lazy(async () => ({
  default: (await import('./contextmenu/EkAbrechnungstypWerteFolder.tsx'))
    .EkAbrechnungstypWerteFolder,
}))
const CmEkAbrechnungstypWerte = lazy(async () => ({
  default: (await import('./contextmenu/EkAbrechnungstypWerte.tsx'))
    .EkAbrechnungstypWerte,
}))
const CmApberuebersichtFolder = lazy(async () => ({
  default: (await import('./contextmenu/ApberuebersichtFolder.tsx'))
    .ApberuebersichtFolder,
}))
const CmApberuebersicht = lazy(async () => ({
  default: (await import('./contextmenu/Apberuebersicht.tsx')).Apberuebersicht,
}))
const CmAssozartFolder = lazy(async () => ({
  default: (await import('./contextmenu/AssozartFolder.tsx')).AssozartFolder,
}))
const CmAssozart = lazy(async () => ({
  default: (await import('./contextmenu/Assozart.tsx')).AssozartFolder,
}))
const CmEkzaehleinheitFolder = lazy(async () => ({
  default: (await import('./contextmenu/EkzaehleinheitFolder.tsx'))
    .EkzaehleinheitFolder,
}))
const CmEkzaehleinheit = lazy(async () => ({
  default: (await import('./contextmenu/Ekzaehleinheit.tsx')).Ekzaehleinheit,
}))
const CmEkfrequenzFolder = lazy(async () => ({
  default: (await import('./contextmenu/EkfrequenzFolder.tsx'))
    .EkfrequenzFolder,
}))
const CmEkfrequenz = lazy(async () => ({
  default: (await import('./contextmenu/Ekfrequenz.tsx')).Ekfrequenz,
}))
const CmApartFolder = lazy(async () => ({
  default: (await import('./contextmenu/ApartFolder.tsx')).ApartFolder,
}))
const CmApart = lazy(async () => ({
  default: (await import('./contextmenu/Apart.tsx')).Apart,
}))
const CmBeobZugeordnetFolder = lazy(async () => ({
  default: (await import('./contextmenu/BeobZugeordnetFolder.tsx'))
    .BeobZugeordnetFolder,
}))
const CmApberFolder = lazy(async () => ({
  default: (await import('./contextmenu/ApberFolder.tsx')).ApberFolder,
}))
const CmApber = lazy(async () => ({
  default: (await import('./contextmenu/Apber.tsx')).Apber,
}))
const CmErfkritFolder = lazy(async () => ({
  default: (await import('./contextmenu/ErfkritFolder.tsx')).ErfkritFolder,
}))
const CmErfkrit = lazy(async () => ({
  default: (await import('./contextmenu/Erfkrit.tsx')).Erfkrit,
}))
const CmZielFolder = lazy(async () => ({
  default: (await import('./contextmenu/ZielFolder.tsx')).ZielFolder,
}))
const CmZielJahrFolder = lazy(async () => ({
  default: (await import('./contextmenu/ZielJahrFolder.tsx')).ZielJahrFolder,
}))
const CmZiel = lazy(async () => ({
  default: (await import('./contextmenu/Ziel.tsx')).Ziel,
}))
const CmPopFolder = lazy(async () => ({
  default: (await import('./contextmenu/PopFolder.tsx')).PopFolder,
}))
const CmPop = lazy(async () => ({
  default: (await import('./contextmenu/Pop.tsx')).Pop,
}))
const CmPopmassnberFolder = lazy(async () => ({
  default: (await import('./contextmenu/PopmassnberFolder.tsx'))
    .PopmassnberFolder,
}))
const CmPopmassnber = lazy(async () => ({
  default: (await import('./contextmenu/Popmassnber.tsx')).Popmassnber,
}))
const CmPopberFolder = lazy(async () => ({
  default: (await import('./contextmenu/PopberFolder.tsx')).PopberFolder,
}))
const CmPopber = lazy(async () => ({
  default: (await import('./contextmenu/Popber.tsx')).Popber,
}))
const CmProjekt = lazy(async () => ({
  default: (await import('./contextmenu/Projekt.tsx')).Projekt,
}))
const CmWerteListen = lazy(async () => ({
  default: (await import('./contextmenu/WerteListen.tsx')).WerteListen,
}))
const CmTpopFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopFolder.tsx')).TpopFolder,
}))
const CmTpop = lazy(async () => ({
  default: (await import('./contextmenu/Tpop.tsx')).Tpop,
}))
const CmTpopberFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopberFolder.tsx')).TpopberFolder,
}))
const CmTpopber = lazy(async () => ({
  default: (await import('./contextmenu/Tpopber.tsx')).Tpopber,
}))
const CmBeobZugeordnet = lazy(async () => ({
  default: (await import('./contextmenu/BeobZugeordnet.tsx')).BeobZugeordnet,
}))
const CmBeobnichtbeurteilt = lazy(async () => ({
  default: (await import('./contextmenu/Beobnichtbeurteilt.tsx'))
    .BeobNichtBeurteilt,
}))
const CmBeobNichtZuzuordnen = lazy(async () => ({
  default: (await import('./contextmenu/BeobNichtZuzuordnen.tsx'))
    .BeobNichtZuzuordnen,
}))
const CmTpopfreiwkontrFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopfreiwkontrFolder.tsx'))
    .TpopfreiwkontrFolder,
}))
const CmTpopfreiwkontr = lazy(async () => ({
  default: (await import('./contextmenu/Tpopfreiwkontr.tsx')).Tpopfreiwkontr,
}))
const CmTpopfeldkontrFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopfeldkontrFolder.tsx'))
    .TpopfeldkontrFolder,
}))
const CmTpopfeldkontr = lazy(async () => ({
  default: (await import('./contextmenu/Tpopfeldkontr.tsx')).Tpopfeldkontr,
}))
const CmTpopfeldkontrzaehlFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopfeldkontrzaehlFolder.tsx'))
    .TpopfeldkontrzaehlFolder,
}))
const CmTpopfeldkontrzaehl = lazy(async () => ({
  default: (await import('./contextmenu/Tpopfeldkontrzaehl.tsx'))
    .Tpopfeldkontrzaehl,
}))
const CmTpopmassnberFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopmassnberFolder.tsx'))
    .TpopmassnberFolder,
}))
const CmTpopmassnber = lazy(async () => ({
  default: (await import('./contextmenu/Tpopmassnber.tsx')).Tpopmassnber,
}))
const CmTpopmassnFolder = lazy(async () => ({
  default: (await import('./contextmenu/TpopmassnFolder.tsx')).TpopmassnFolder,
}))
const CmTpopmassn = lazy(async () => ({
  default: (await import('./contextmenu/Tpopmassn.tsx')).Tpopmassn,
}))
const TpopFromBeobPopList = lazy(async () => ({
  default: (await import('./TpopFromBeobPopList.tsx')).TpopFromBeobPopList,
}))
const ErrorBoundary = lazy(async () => ({
  default: (await import('../../shared/ErrorBoundary.tsx')).ErrorBoundary,
}))

import { copyBiotopTo } from '../../../modules/copyBiotopTo.ts'
import { moveTo } from '../../../modules/moveTo/index.ts'
import { copyTo } from '../../../modules/copyTo/index.ts'
import { createNewPopFromBeob } from '../../../modules/createNewPopFromBeob/index.ts'
import { copyBeobZugeordnetKoordToTpop } from '../../../modules/copyBeobZugeordnetKoordToTpop/index.ts'
import { copyTpopKoordToPop } from '../../../modules/copyTpopKoordToPop/index.ts'
import { openLowerNodes } from './openLowerNodes/index.ts'
import { closeLowerNodes } from './closeLowerNodes.ts'
import { insertDataset } from './insertDataset.ts'
import { useProjekteTabs } from '../../../modules/useProjekteTabs.ts'
import { showCoordOfBeobOnMapsZhCh } from '../../../modules/showCoordOfBeobOnMapsZhCh.ts'
import { showCoordOfBeobOnMapGeoAdminCh } from '../../../modules/showCoordOfBeobOnMapGeoAdminCh.ts'
import { getAndValidateCoordinatesOfTpop } from '../../../modules/getAndValidateCoordinatesOfTpop.ts'
import { showCoordOfTpopOnMapsZhCh } from '../../../modules/showCoordOfTpopOnMapsZhCh.ts'
import { showCoordOfTpopOnMapGeoAdminCh } from '../../../modules/showCoordOfTpopOnMapGeoAdminCh.ts'
import {
  setCopyingAtom,
  setCopyingBiotopAtom,
  setMovingAtom,
  setToDeleteAtom,
  setIdOfTpopBeingLocalizedAtom,
  mapActiveApfloraLayersAtom,
  setMapActiveApfloraLayersAtom,
} from '../../../store/index.ts'

import styles from './Menus.module.css'

export const Menus = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const params = useParams()
  const { projId, apId, popId } = params
  const { search } = useLocation()

  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)
  const setActiveApfloraLayers = useSetAtom(setMapActiveApfloraLayersAtom)
  const setCopying = useSetAtom(setCopyingAtom)
  const setMoving = useSetAtom(setMovingAtom)
  const setCopyingBiotop = useSetAtom(setCopyingBiotopAtom)
  const setToDelete = useSetAtom(setToDeleteAtom)
  const setIdOfTpopBeingLocalized = useSetAtom(setIdOfTpopBeingLocalizedAtom)

  const [newTpopFromBeobDialogOpen, setNewTpopFromBeobDialogOpen] = useAtom(
    newTpopFromBeobDialogOpenAtom,
  )
  const [newTpopFromBeobBeobId, setNewTpopFromBeobBeobId] = useAtom(
    newTpopFromBeobBeobIdAtom,
  )
  const closeNewTpopFromBeobDialog = () => setNewTpopFromBeobDialogOpen(false)

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
  const showMapIfNotYetVisible = (projekteTabs) => {
    const isVisible = projekteTabs.includes('karte')
    if (!isVisible) {
      setProjekteTabs([...projekteTabs, 'karte'])
    }
  }

  const handleClick = (e, data, element) => {
    // console.log('TreeContainer, handleClick', { e, data, element })
    if (!data) {
      return addNotification({
        message: 'no data passed with click',
        options: {
          variant: 'error',
        },
      })
    }
    if (!element) {
      return addNotification({
        message: 'no element passed with click',
        options: {
          variant: 'error',
        },
      })
    }
    const { table, action, actionTable } = data
    const { firstElementChild } = element
    if (!firstElementChild) {
      return addNotification({
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
          jahr,
        })
      },
      closeLowerNodes() {
        closeLowerNodes({
          url,
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
            tsQueryClient.invalidateQueries({
              queryKey: [`tree${upperFirst(table)}`],
            })
            // also invalidate parent queries for folder counts
            tsQueryClient.invalidateQueries({
              queryKey: [`treeApFolders`],
            })
            tsQueryClient.invalidateQueries({
              queryKey: [`treeAp`],
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
          id,
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
        copyTo({
          parentId: nodeType === 'folder' ? parentId : id,
        })
      },
      markForCopyingBiotop() {
        setCopyingBiotop({ id, label })
      },
      resetCopyingBiotop() {
        setCopyingBiotop({ id: null, label: null })
      },
      copyBiotop() {
        copyBiotopTo({ id })
      },
      copyTpopKoordToPop() {
        copyTpopKoordToPop({ id })
      },
      createNewPopFromBeob() {
        createNewPopFromBeob({
          id,
          apId,
          projId,
          search,
        })
      },
      createNewTpopFromBeob() {
        setNewTpopFromBeobBeobId(id)
        setNewTpopFromBeobDialogOpen(true)
      },
      copyBeobZugeordnetKoordToTpop() {
        copyBeobZugeordnetKoordToTpop({ id })
      },
      async showCoordOfTpopOnMapsZhCh() {
        showCoordOfTpopOnMapsZhCh({
          id,
        })
      },
      async showCoordOfTpopOnMapGeoAdminCh() {
        showCoordOfTpopOnMapGeoAdminCh({
          id,
        })
      },
      async showCoordOfBeobOnMapsZhCh() {
        showCoordOfBeobOnMapsZhCh({
          id,
        })
      },
      async showCoordOfBeobOnMapGeoAdminCh() {
        showCoordOfBeobOnMapGeoAdminCh({
          id,
        })
      },
    }
    if (Object.keys(actions).includes(action)) {
      actions[action]()
    } else {
      addNotification({
        message: `action "${action}" unknown, therefore not executed`,
        options: {
          variant: 'error',
        },
      })
    }
  }

  return (
    <ErrorBoundary>
      <div className="tree-menu-container">
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
          <Dialog
            open={newTpopFromBeobDialogOpen}
            onClose={closeNewTpopFromBeobDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xl"
            className={styles.dialog}
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
          </Dialog>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
