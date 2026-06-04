import { useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import {
  FaPlus,
  FaMinus,
  FaFolder,
  FaFolderTree,
  FaMapLocationDot,
} from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import ToggleButton from '@mui/material/ToggleButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { isEqual } from 'es-toolkit'
import { uniq } from 'es-toolkit'
import { useSetAtom, useAtomValue } from 'jotai'

import type { TpopId, PopId } from '../../../../generated/apflora/models.ts'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.ts'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.ts'
import { useProjekteTabs } from '../../../../modules/useProjekteTabs.ts'
import { moveTo } from '../../../../modules/moveTo/index.ts'
import { copyTo } from '../../../../modules/copyTo/index.ts'
import { copyTpopKoordToPop } from '../../../../modules/copyTpopKoordToPop/index.ts'
import { showCoordOfTpopOnMapGeoAdminCh } from '../../../../modules/showCoordOfTpopOnMapGeoAdminCh.ts'
import { showCoordOfTpopOnMapsZhCh } from '../../../../modules/showCoordOfTpopOnMapsZhCh.ts'
import {
  showTreeMenusAtom,
  addNotificationAtom,
  movingAtom,
  setMovingAtom,
  copyingAtom,
  setCopyingAtom,
  idOfTpopBeingLocalizedAtom,
  setIdOfTpopBeingLocalizedAtom,
  mapActiveApfloraLayersAtom,
  setMapActiveApfloraLayersAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../../store/index.ts'

import menuStyles from '../../../shared/Files/Menu/index.module.css'
import styles from './Menu.module.css'

interface CreateTpopResult {
  createTpop: {
    tpop: {
      id: TpopId
      popId: PopId
    }
  }
}

interface MenuProps {
  row: {
    id: TpopId
    label?: string
    lv95X?: number | null
    lv95Y?: number | null
  }
}

const iconStyle = { color: 'white' }

export const Menu = ({ row }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, popId, tpopId } = useParams()

  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)
  const setActiveApfloraLayers = useSetAtom(setMapActiveApfloraLayersAtom)
  const idOfTpopBeingLocalized = useAtomValue(idOfTpopBeingLocalizedAtom)
  const setIdOfTpopBeingLocalized = useSetAtom(setIdOfTpopBeingLocalizedAtom)
  const moving = useAtomValue(movingAtom)
  const setMoving = useSetAtom(setMovingAtom)
  const copying = useAtomValue(copyingAtom)
  const setCopying = useSetAtom(setCopyingAtom)
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result
    try {
      result = await apolloClient.mutate<CreateTpopResult>({
        mutation: gql`
          mutation createTpopForTpopForm($popId: UUID!) {
            createTpop(input: { tpop: { popId: $popId } }) {
              tpop {
                id
                popId
              }
            }
          }
        `,
        variables: {
          popId,
        },
      })
    } catch (error) {
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treePopFolders`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treePop`],
    })
    const id = result?.data?.createTpop?.tpop?.id
    navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${id}/Teil-Population${search}`,
    )
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = async () => {
    let result
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation deleteTpop($id: UUID!) {
            deleteTpopById(input: { id: $id }) {
              tpop {
                id
              }
            }
          }
        `,
        variables: { id: tpopId },
      })
    } catch (error) {
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }

    // remove active path from openNodes
    const activePath = pathname.split('/').filter((p) => !!p)
    const newOpenNodes = openNodes.filter((n) => !isEqual(n, activePath))
    setOpenNodes(newOpenNodes)

    // update tree query
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treePopFolders`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treePop`],
    })
    // navigate to parent
    navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen${search}`,
    )
  }

  const onClickOpenLowerNodes = () =>
    openLowerNodes({
      id: tpopId,
      projId,
      apId,
      popId,
      menuType: 'tpop',
      parentId: popId,
    })

  const onClickCloseLowerNodes = () =>
    closeLowerNodes({
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
      ],
      search,
    })

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()
  const showMapIfNotYetVisible = (projekteTabs) => {
    const isVisible = projekteTabs.includes('karte')

    if (!isVisible) {
      setProjekteTabs([...projekteTabs, 'karte'])
    }
  }

  const isLocalizing = !!idOfTpopBeingLocalized
  const onClickLocalizeOnMap = () => {
    if (isLocalizing) {
      return setIdOfTpopBeingLocalized(null)
    }
    setIdOfTpopBeingLocalized(tpopId)
    showMapIfNotYetVisible(projekteTabs)
    setActiveApfloraLayers(uniq([...activeApfloraLayers, 'tpop']))
  }

  const isMovingTpop = moving.table === 'tpop'
  const thisTpopIsMoving = moving.id === tpopId
  const movingFromThisPop = moving.fromParentId === popId
  const isMovingTpopfeldkontr = moving.table === 'tpopfeldkontr'
  const isMovingTpopfreiwkontr = moving.table === 'tpopfreiwkontr'
  const isMovingTpopmassn = moving.table === 'tpopmassn'

  const onClickMoveInTree = () => {
    if (isMovingTpop) {
      // move to this pop
      return moveTo({ id: popId })
    }
    if (isMovingTpopfeldkontr || isMovingTpopfreiwkontr || isMovingTpopmassn) {
      // move to this tpop
      return moveTo({ id: tpopId })
    }
    setMoving({
      id: row.id,
      label: row.label,
      table: 'tpop',
      toTable: 'tpop',
      fromParentId: popId,
    })
  }

  const onClickStopMoving = () =>
    setMoving({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      toTable: null,
      fromParentId: null,
    })

  const isCopyingTpop = copying.table === 'tpop'
  const thisTpopIsCopying = copying.id === tpopId
  const isCopyingFeldkontr = copying.table === 'tpopfeldkontr'
  const isCopyingFreiwkontr = copying.table === 'tpopfreiwkontr'
  const isCopyingMassn = copying.table === 'tpopmassn'
  const isCopying =
    isCopyingTpop || isCopyingFeldkontr || isCopyingFreiwkontr || isCopyingMassn

  const onClickCopy = () => {
    if (isCopyingTpop) {
      // copy to this pop
      return copyTo({ parentId: popId })
    }
    if (isCopyingFeldkontr || isCopyingFreiwkontr || isCopyingMassn) {
      // copy to this tpop
      return copyTo({ parentId: tpopId })
    }
    setCopying({
      table: 'tpop',
      id: tpopId,
      label: row.label,
      withNextLevel: false,
    })
  }

  const onClickStopCopying = () =>
    setCopying({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      withNextLevel: false,
    })

  const tpopHasCoord = !!row.lv95X && !!row.lv95Y
  const [copyingCoordToTpop, setCopyingCoordToTpop] = useState(false)

  const onCopyCoordToPop = async () => {
    setCopyingCoordToTpop(true)
    await copyTpopKoordToPop({ id: tpopId })
    setCopyingCoordToTpop(false)
  }

  const onClickShowCoordOfTpopOnMapGeoAdminCh = () =>
    showCoordOfTpopOnMapGeoAdminCh({
      id: tpopId,
    })

  const onClickShowCoordOfTpopOnMapsZhCh = () =>
    showCoordOfTpopOnMapsZhCh({
      id: tpopId,
    })

  // to paste copied feldkontr/freiwkontr/massn
  const onClickCopyLowerElementToHere = () => copyTo({ parentId: tpopId })

  const showTreeMenus = useAtomValue(showTreeMenusAtom)

  // ISSUE: refs are sometimes/often not set on first render
  // trying to measure widths of menus leads to complete chaos
  // so passing in static widths instead

  return (
    <ErrorBoundary>
      <MenuBar
        rerenderer={`${idOfTpopBeingLocalized}/${isMovingTpop}/${moving.label}/${isCopyingTpop}/${copying.label}/${movingFromThisPop}/${thisTpopIsMoving}/${thisTpopIsCopying}/${copyingCoordToTpop}/${tpopHasCoord}/${showTreeMenus}`}
      >
        <Tooltip title="Neue Teil-Population erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Löschen">
          <IconButton
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'tpopDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
        </Tooltip>
        {showTreeMenus && (
          <Tooltip title="Ordner im Navigationsbaum öffnen">
            <IconButton onClick={onClickOpenLowerNodes}>
              <FaFolderTree style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {showTreeMenus && (
          <Tooltip title="Ordner im Navigationsbaum schliessen">
            <IconButton onClick={onClickCloseLowerNodes}>
              <RiFolderCloseFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Auf Karte verorten (mit Doppelklick)">
          <ToggleButton
            value={idOfTpopBeingLocalized ?? ''}
            onChange={onClickLocalizeOnMap}
            selected={isLocalizing}
            className={styles.roundToggleButton}
          >
            <FaMapLocationDot style={iconStyle} />
          </ToggleButton>
        </Tooltip>
        <Tooltip
          title={
            !isMovingTpop ? `'${row.label}' hierhin verschieben`
            : thisTpopIsMoving ?
              'Zum Verschieben gemerkt, bereit um in einer anderen Population einzufügen'
            : movingFromThisPop ?
              `'${moving.label}' zur selben Population zu vershieben, macht keinen Sinn`
            : `Verschiebe '${moving.label}' zu dieser Population`
          }
        >
          <IconButton onClick={onClickMoveInTree}>
            <MdOutlineMoveDown
              style={{
                color:
                  isMovingTpop && thisTpopIsMoving ? 'rgb(255, 90, 0)' : (
                    'white'
                  ),
              }}
            />
          </IconButton>
        </Tooltip>
        {isMovingTpop && (
          <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
            <IconButton onClick={onClickStopMoving}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip
          title={
            isCopying ?
              `Kopiere '${copying.label}' in diese Population`
            : 'Kopieren'
          }
        >
          <IconButton onClick={onClickCopy}>
            <MdContentCopy
              style={{
                color: thisTpopIsCopying ? 'rgb(255, 90, 0)' : 'white',
              }}
            />
          </IconButton>
        </Tooltip>
        {isCopying && (
          <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
            <IconButton onClick={onClickStopCopying}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {tpopHasCoord && (
          <Button
            variant="outlined"
            onClick={onCopyCoordToPop}
            loading={copyingCoordToTpop}
            width={155}
            className={styles.styledLoadingButton}
          >
            Koordinaten auf die
            <br />
            Population kopieren
          </Button>
        )}
        <Button
          variant="outlined"
          onClick={onClickShowCoordOfTpopOnMapsZhCh}
          width={103}
          className={styles.styledButton}
        >
          zeige auf
          <br />
          maps.zh.ch
        </Button>
        <Button
          variant="outlined"
          onClick={onClickShowCoordOfTpopOnMapGeoAdminCh}
          width={146}
          className={styles.styledButton}
        >
          zeige auf
          <br />
          map.geo.admin.ch
        </Button>
      </MenuBar>
      <MuiMenu
        id="tpopDelMenu"
        anchorEl={delMenuAnchorEl}
        open={delMenuOpen}
        onClose={() => setDelMenuAnchorEl(null)}
      >
        <h3 className={menuStyles.menuTitle}>löschen?</h3>
        <MenuItem onClick={onClickDelete}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
    </ErrorBoundary>
  )
}
