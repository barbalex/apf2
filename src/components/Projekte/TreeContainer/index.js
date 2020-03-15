/**
 * need to keep class because of ref
 */
import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import camelCase from 'lodash/camelCase'
import isEqual from 'lodash/isEqual'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import ErrorBoundary from 'react-error-boundary'

import LabelFilter from './LabelFilter'
import ApFilter from './ApFilter'
import Tree from './Tree'
import CmApFolder from './contextmenu/ApFolder'
import CmAp from './contextmenu/Ap'
import CmUserFolder from './contextmenu/UserFolder'
import CmUser from './contextmenu/User'
import CmAdresseFolder from './contextmenu/AdresseFolder'
import CmAdresse from './contextmenu/Adresse'
import CmTpopApberrelevantGrundWerteFolder from './contextmenu/TpopApberrelevantGrundWerteFolder'
import CmTpopApberrelevantGrundWerte from './contextmenu/TpopApberrelevantGrundWerte'
import CmTpopkontrzaehlEinheitWerteFolder from './contextmenu/TpopkontrzaehlEinheitWerteFolder'
import CmTpopkontrzaehlEinheitWerte from './contextmenu/TpopkontrzaehlEinheitWerte'
import CmEkAbrechnungstypWerteFolder from './contextmenu/EkAbrechnungstypWerteFolder'
import CmEkAbrechnungstypWerte from './contextmenu/EkAbrechnungstypWerte'
import CmApberuebersichtFolder from './contextmenu/ApberuebersichtFolder'
import CmApberuebersicht from './contextmenu/Apberuebersicht'
import CmAssozartFolder from './contextmenu/AssozartFolder'
import CmAssozart from './contextmenu/Assozart'
import CmEkzaehleinheitFolder from './contextmenu/EkzaehleinheitFolder'
import CmEkzaehleinheit from './contextmenu/Ekzaehleinheit'
import CmEkfrequenzFolder from './contextmenu/EkfrequenzFolder'
import CmEkfrequenz from './contextmenu/Ekfrequenz'
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
import CmTpopfeldkontrFolder from './contextmenu/TpopfeldkontrFolder'
import CmTpopfeldkontr from './contextmenu/Tpopfeldkontr'
import CmTpopfeldkontrzaehlFolder from './contextmenu/TpopfeldkontrzaehlFolder'
import CmTpopfeldkontrzaehl from './contextmenu/Tpopfeldkontrzaehl'
import CmTpopmassnberFolder from './contextmenu/TpopmassnberFolder'
import CmTpopmassnber from './contextmenu/Tpopmassnber'
import CmTpopmassnFolder from './contextmenu/TpopmassnFolder'
import CmTpopmassn from './contextmenu/Tpopmassn'
import DeleteDatasetModal from './DeleteDatasetModal'
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
import storeContext from '../../../storeContext'
import TpopFromBeobPopList from './TpopFromBeobPopList'

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
    margin: 2px 0 0;
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
const InnerTreeContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
`
const StyledDialog = styled(Dialog)`
  overflow-y: hidden;
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
  const tpop = get(tpopResult, 'data.tpopById')
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
  const beob = get(beobResult, 'data.beobById')
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

const TreeContainer = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
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
    urlQuery,
    setUrlQuery,
    refetch,
  } = store
  const { openNodes, setOpenNodes, setActiveNodeArray } = store[treeName]
  const { projekt } = store[`${treeName}ActiveNodes`]

  const [newTpopFromBeobDialogOpen, setNewTpopFromBeobDialogOpen] = useState(
    false,
  )
  const [newTpopFromBeobBeobId, setNewTpopFromBeobBeobId] = useState(null)
  const closeNewTpopFromBeobDialog = useCallback(
    () => setNewTpopFromBeobDialogOpen(false),
    [],
  )

  const showMapIfNotYetVisible = useCallback(
    projekteTabs => {
      const isVisible = projekteTabs.includes('karte')
      if (!isVisible) {
        setUrlQueryValue({
          key: 'projekteTabs',
          value: [...projekteTabs, 'karte'],
          urlQuery,
          setUrlQuery,
        })
      }
    },
    [setUrlQuery, urlQuery],
  )
  const handleClick = useCallback(
    (e, data, element) => {
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
            store,
          })
        },
        openLowerNodes() {
          openLowerNodes({
            treeName,
            id,
            parentId,
            menuType,
            client,
            store,
          })
        },
        closeLowerNodes() {
          closeLowerNodes({
            treeName,
            url,
            store,
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
              : camelCase(table)
            refetch[`${tableToUse}s`]()
            refetch.tree()
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
            treeName,
            id,
            client,
            store,
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
            typeof window !== 'undefined' &&
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
            typeof window !== 'undefined' &&
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
            typeof window !== 'undefined' &&
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
            typeof window !== 'undefined' &&
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
      treeName,
      client,
      store,
      setToDelete,
      openNodes,
      setActiveNodeArray,
      setOpenNodes,
      refetch,
      urlQuery,
      showMapIfNotYetVisible,
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

  return (
    <ErrorBoundary>
      <Container data-id={`tree-container${treeName === 'tree' ? 1 : 2}`}>
        {!!toDeleteId && <DeleteDatasetModal treeName={treeName} />}
        <LabelFilterContainer>
          <LabelFilter treeName={treeName} />
          {!!projekt && <ApFilter treeName={treeName} />}
        </LabelFilterContainer>
        <InnerTreeContainer>
          <Tree treeName={treeName} />
        </InnerTreeContainer>
        <CmApFolder onClick={handleClick} treeName={treeName} />
        <CmAp onClick={handleClick} treeName={treeName} />
        <CmApberuebersichtFolder onClick={handleClick} treeName={treeName} />
        <CmApberuebersicht onClick={handleClick} treeName={treeName} />
        <CmAssozartFolder onClick={handleClick} treeName={treeName} />
        <CmAssozart onClick={handleClick} treeName={treeName} />
        <CmEkzaehleinheitFolder onClick={handleClick} treeName={treeName} />
        <CmEkzaehleinheit onClick={handleClick} treeName={treeName} />
        <CmEkfrequenzFolder onClick={handleClick} treeName={treeName} />
        <CmEkfrequenz onClick={handleClick} treeName={treeName} />
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
        <CmTpopApberrelevantGrundWerteFolder
          onClick={handleClick}
          treeName={treeName}
        />
        <CmEkAbrechnungstypWerteFolder
          onClick={handleClick}
          treeName={treeName}
        />
        <CmEkAbrechnungstypWerte onClick={handleClick} treeName={treeName} />
        <CmTpopkontrzaehlEinheitWerteFolder
          onClick={handleClick}
          treeName={treeName}
        />
        <CmTpopkontrzaehlEinheitWerte
          onClick={handleClick}
          treeName={treeName}
        />
        <CmAdresse onClick={handleClick} treeName={treeName} />
        <CmTpopApberrelevantGrundWerte
          onClick={handleClick}
          treeName={treeName}
        />
        <StyledDialog
          open={newTpopFromBeobDialogOpen}
          onClose={closeNewTpopFromBeobDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Population wählen:'}
          </DialogTitle>
          <TpopFromBeobPopList
            treeName={treeName}
            beobId={newTpopFromBeobBeobId}
            closeNewTpopFromBeobDialog={closeNewTpopFromBeobDialog}
          />
          <DialogActions>
            <Button onClick={closeNewTpopFromBeobDialog}>abbrechen</Button>
          </DialogActions>
        </StyledDialog>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(TreeContainer)
