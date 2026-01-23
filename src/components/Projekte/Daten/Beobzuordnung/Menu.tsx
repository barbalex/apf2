import { useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { isEqual } from 'es-toolkit'
import Button from '@mui/material/Button'

import { useSetAtom, useAtom } from 'jotai'
import {
  newTpopFromBeobDialogOpenAtom,
  newTpopFromBeobBeobIdAtom,
  addNotificationAtom,
} from '../../../../JotaiStore/index.ts'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { showCoordOfBeobOnMapsZhCh } from '../../../../modules/showCoordOfBeobOnMapsZhCh.ts'
import { showCoordOfBeobOnMapGeoAdminCh } from '../../../../modules/showCoordOfBeobOnMapGeoAdminCh.ts'
import { copyBeobZugeordnetKoordToTpop } from '../../../../modules/copyBeobZugeordnetKoordToTpop/index.ts'
import { createNewPopFromBeob } from '../../../../modules/createNewPopFromBeob/index.ts'

import styles from '../Tpop/Menu.module.css'

export const Menu = () => {
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, beobId, tpopId } = useParams<{
    projId: string
    apId: string
    beobId: string
    tpopId?: string
  }>()

  const apolloClient = useApolloClient()

  const isBeobZugeordnet = !!tpopId
  const isBeobNichtBeurteilt =
    !tpopId && pathname.includes('nicht-beurteilte-Beobachtungen')
  const isBeobNichtZuzuordnen =
    !tpopId && pathname.includes('nicht-zuzuordnende-Beobachtungen')

  const [
    copyingBeobZugeordnetKoordToTpop,
    setCopyingBeobZugeordnetKoordToTpop,
  ] = useState(false)
  const onClickCopyingBeobZugeordnetKoordToTpop = async () => {
    setCopyingBeobZugeordnetKoordToTpop(true)
    await copyBeobZugeordnetKoordToTpop({
      id: beobId,
    })
    setCopyingBeobZugeordnetKoordToTpop(false)
  }

  const onClickShowCoordOfBeobOnMapGeoAdminCh = () => {
    showCoordOfBeobOnMapGeoAdminCh({
      id: beobId,
    })
  }

  const onClickShowCoordOfBeobOnMapsZhCh = () => {
    showCoordOfBeobOnMapsZhCh({
      id: beobId,
    })
  }

  const [creatingNewPopFromBeob, setCreatingNewPopFromBeob] = useState(false)
  const onClickCreateNewPopFromBeob = async () => {
    setCreatingNewPopFromBeob(true)
    await createNewPopFromBeob({
      id: beobId,
      apId,
      projId,
      search,
    })
    setTimeout(() => {
      setCreatingNewPopFromBeob(false)
    }, 500)
  }

  const [newTpopFromBeobDialogOpen, setNewTpopFromBeobDialogOpen] = useAtom(
    newTpopFromBeobDialogOpenAtom,
  )
  const [newTpopFromBeobBeobId, setNewTpopFromBeobBeobId] = useAtom(
    newTpopFromBeobBeobIdAtom,
  )
  const closeNewTpopFromBeobDialog = () => setNewTpopFromBeobDialogOpen(false)

  const onClickNewTpopFromBeob = () => {
    setNewTpopFromBeobBeobId(beobId)
    setNewTpopFromBeobDialogOpen(true)
  }

  // ISSUE: refs are sometimes/often not set on first render
  // trying to measure widths of menus leads to complete chaos
  // so passing in static widths instead

  return (
    <ErrorBoundary>
      <MenuBar
        rerenderer={`${copyingBeobZugeordnetKoordToTpop}/${isBeobZugeordnet}/${isBeobNichtBeurteilt}/${creatingNewPopFromBeob}`}
      >
        {isBeobZugeordnet && (
          <Button
            variant="outlined"
            onClick={onClickCopyingBeobZugeordnetKoordToTpop}
            loading={copyingBeobZugeordnetKoordToTpop}
            width={190}
            className={styles.styledLoadingButton}
          >
            Koordinaten auf die
            <br />
            Teilpopulation übertragen
          </Button>
        )}
        {isBeobNichtBeurteilt && (
          <Button
            variant="outlined"
            onClick={onClickCreateNewPopFromBeob}
            loading={creatingNewPopFromBeob}
            width={245}
            className={styles.styledLoadingButton}
          >
            {'Pop. und TPop. gründen >'}
            <br />
            {'Beobachtung der TPop. zuordnen'}
          </Button>
        )}
        {isBeobNichtBeurteilt && (
          <Button
            variant="outlined"
            onClick={onClickNewTpopFromBeob}
            width={258}
            className={styles.styledButton}
          >
            {'TPop. in bestehender Pop. gründen'}
            <br />
            {'> Beobachtung der TPop. zuordnen'}
          </Button>
        )}
        <Button
          variant="outlined"
          onClick={onClickShowCoordOfBeobOnMapsZhCh}
          width={105}
          className={styles.styledButton}
        >
          zeige auf
          <br />
          maps.zh.ch
        </Button>
        <Button
          variant="outlined"
          onClick={onClickShowCoordOfBeobOnMapGeoAdminCh}
          width={147}
          className={styles.styledButton}
        >
          zeige auf
          <br />
          map.geo.admin.ch
        </Button>
      </MenuBar>
    </ErrorBoundary>
  )
}
