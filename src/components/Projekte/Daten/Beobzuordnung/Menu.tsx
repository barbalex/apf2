import { useState } from 'react'
import type { ComponentType } from 'react'
import { useParams, useLocation } from 'react-router'
import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'

import { useAtom } from 'jotai'
import {
  newTpopFromBeobDialogOpenAtom,
  newTpopFromBeobBeobIdAtom,
} from '../../../../store/index.ts'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { showCoordOfBeobOnMapsZhCh } from '../../../../modules/showCoordOfBeobOnMapsZhCh.ts'
import { showCoordOfBeobOnMapGeoAdminCh } from '../../../../modules/showCoordOfBeobOnMapGeoAdminCh.ts'
import { copyBeobZugeordnetKoordToTpop } from '../../../../modules/copyBeobZugeordnetKoordToTpop/index.ts'
import { createNewPopFromBeob } from '../../../../modules/createNewPopFromBeob/index.ts'

import styles from '../Tpop/Menu.module.css'

interface MenuButtonProps extends ButtonProps {
  // legacy prop, passed through to the DOM by MUI without effect
  width?: number
}

const MenuButton = Button as unknown as ComponentType<MenuButtonProps>

export const Menu = () => {
  const { search, pathname } = useLocation()
  // this component only renders on routes containing projId, apId and beobId
  const { projId, apId, beobId, tpopId } = useParams<{
    projId: string
    apId: string
    beobId: string
    tpopId?: string
  }>() as {
    projId: string
    apId: string
    beobId: string
    tpopId?: string | undefined
  }

  const isBeobZugeordnet = !!tpopId
  const isBeobNichtBeurteilt =
    !tpopId && pathname.includes('nicht-beurteilte-Beobachtungen')

  const [
    copyingBeobZugeordnetKoordToTpop,
    setCopyingBeobZugeordnetKoordToTpop,
  ] = useState(false)
  const onClickCopyingBeobZugeordnetKoordToTpop = async () => {
    if (!beobId) return
    setCopyingBeobZugeordnetKoordToTpop(true)
    await copyBeobZugeordnetKoordToTpop({
      id: beobId,
    })
    setCopyingBeobZugeordnetKoordToTpop(false)
  }

  const onClickShowCoordOfBeobOnMapGeoAdminCh = () => {
    void showCoordOfBeobOnMapGeoAdminCh({
      id: beobId,
    })
  }

  const onClickShowCoordOfBeobOnMapsZhCh = () => {
    void showCoordOfBeobOnMapsZhCh({
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

  const [, setNewTpopFromBeobDialogOpen] = useAtom(
    newTpopFromBeobDialogOpenAtom,
  )
  const [, setNewTpopFromBeobBeobId] = useAtom(newTpopFromBeobBeobIdAtom)

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
          <MenuButton
            variant="outlined"
            onClick={() => void onClickCopyingBeobZugeordnetKoordToTpop()}
            loading={copyingBeobZugeordnetKoordToTpop}
            width={190}
            className={styles.styledLoadingButton}
          >
            Koordinaten auf die
            <br />
            Teilpopulation übertragen
          </MenuButton>
        )}
        {isBeobNichtBeurteilt && (
          <MenuButton
            variant="outlined"
            onClick={() => void onClickCreateNewPopFromBeob()}
            loading={creatingNewPopFromBeob}
            width={245}
            className={styles.styledLoadingButton}
          >
            {'Pop. und TPop. gründen >'}
            <br />
            {'Beobachtung der TPop. zuordnen'}
          </MenuButton>
        )}
        {isBeobNichtBeurteilt && (
          <MenuButton
            variant="outlined"
            onClick={onClickNewTpopFromBeob}
            width={258}
            className={styles.styledButton}
          >
            {'TPop. in bestehender Pop. gründen'}
            <br />
            {'> Beobachtung der TPop. zuordnen'}
          </MenuButton>
        )}
        <MenuButton
          variant="outlined"
          onClick={onClickShowCoordOfBeobOnMapsZhCh}
          width={105}
          className={styles.styledButton}
        >
          zeige auf
          <br />
          maps.zh.ch
        </MenuButton>
        <MenuButton
          variant="outlined"
          onClick={onClickShowCoordOfBeobOnMapGeoAdminCh}
          width={147}
          className={styles.styledButton}
        >
          zeige auf
          <br />
          map.geo.admin.ch
        </MenuButton>
      </MenuBar>
    </ErrorBoundary>
  )
}
