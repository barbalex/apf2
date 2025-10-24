import { useContext, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
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
import styled from '@emotion/styled'
import { useAtom } from 'jotai'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { useProjekteTabs } from '../../../../modules/useProjekteTabs.js'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { copyTpopKoordToPop } from '../../../../modules/copyTpopKoordToPop/index.js'
import { showCoordOfTpopOnMapGeoAdminCh } from '../../../../modules/showCoordOfTpopOnMapGeoAdminCh.js'
import { showCoordOfTpopOnMapsZhCh } from '../../../../modules/showCoordOfTpopOnMapsZhCh.js'
import { showTreeMenusAtom } from '../../../../JotaiStore/index.js'

// unfortunately, toggle buttons are different from icon buttons...
const RoundToggleButton = styled(ToggleButton)`
  border-radius: 50%;
  border-width: 0;
  padding: 8px;
  svg {
    height: 24px;
    width: 24px;
  }
`
const MoveIcon = styled(MdOutlineMoveDown)`
  color: ${(props) =>
    props.moving === 'true' ? 'rgb(255, 90, 0) !important' : 'white'};
`
const CopyIcon = styled(MdContentCopy)`
  color: ${(props) =>
    props.copying === 'true' ? 'rgb(255, 90, 0) !important' : 'white'};
`
export const StyledLoadingButton = styled(Button)`
  margin: 0 5px;
  padding: 3px 10px;
  text-transform: none;
  line-height: 1.1;
  font-size: 0.8rem;
  max-height: 40px;
  color: white;
  border-width: 0.67px;
  border-color: rgba(255, 255, 255, 0.5) !important;
  // prevent text from breaking into multiple lines
  flex-shrink: 0;
  flex-grow: 0;
`
export const StyledButton = styled(Button)`
  margin: 0 5px;
  padding: 3px 10px;
  text-transform: none;
  line-height: 1.1;
  font-size: 0.8rem;
  max-height: 40px;
  color: white;
  border-width: 0.67px;
  border-color: rgba(255, 255, 255, 0.5) !important;
  // prevent text from breaking into multiple lines
  flex-shrink: 0;
  flex-grow: 0;
`
const iconStyle = { color: 'white' }

export const Menu = observer(({ row }) => {
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, popId, tpopId } = useParams()

  const store = useContext(MobxContext)
  const {
    setIdOfTpopBeingLocalized,
    idOfTpopBeingLocalized,
    activeApfloraLayers,
    setActiveApfloraLayers,
    setMoving,
    moving,
    setCopying,
    copying,
  } = store

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result
    try {
      result = await apolloClient.mutate({
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
      return store.enqueNotification({
        message: error.message,
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

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
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
      return store.enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }

    // remove active path from openNodes
    const openNodesRaw = store?.tree?.openNodes
    const openNodes = getSnapshot(openNodesRaw)
    const activePath = pathname.split('/').filter((p) => !!p)
    const newOpenNodes = openNodes.filter((n) => !isEqual(n, activePath))
    store.tree.setOpenNodes(newOpenNodes)

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
      apolloClient,
      store,
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
      store,
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
      return moveTo({
        id: popId,
        apolloClient,
        store,
      })
    }
    if (isMovingTpopfeldkontr || isMovingTpopfreiwkontr || isMovingTpopmassn) {
      // move to this tpop
      return moveTo({
        id: tpopId,
        apolloClient,
        store,
      })
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
      return copyTo({
        parentId: popId,
        apolloClient,
        store,
      })
    }
    if (isCopyingFeldkontr || isCopyingFreiwkontr || isCopyingMassn) {
      // copy to this tpop
      return copyTo({
        parentId: tpopId,
        apolloClient,
        store,
      })
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
    await copyTpopKoordToPop({ id: tpopId, store, apolloClient })
    setCopyingCoordToTpop(false)
  }

  const onClickShowCoordOfTpopOnMapGeoAdminCh = () =>
    showCoordOfTpopOnMapGeoAdminCh({
      id: tpopId,
      apolloClient,
      enqueNotification: store.enqueNotification,
    })

  const onClickShowCoordOfTpopOnMapsZhCh = () =>
    showCoordOfTpopOnMapsZhCh({
      id: tpopId,
      apolloClient,
      enqueNotification: store.enqueNotification,
    })

  // to paste copied feldkontr/freiwkontr/massn
  const onClickCopyLowerElementToHere = () =>
    copyTo({
      parentId: tpopId,
      apolloClient,
      store,
    })

  const [showTreeMenus] = useAtom(showTreeMenusAtom)

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
          <RoundToggleButton
            value={idOfTpopBeingLocalized ?? ''}
            onChange={onClickLocalizeOnMap}
            selected={isLocalizing}
          >
            <FaMapLocationDot style={iconStyle} />
          </RoundToggleButton>
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
            <MoveIcon moving={(isMovingTpop && thisTpopIsMoving).toString()} />
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
            <CopyIcon copying={thisTpopIsCopying.toString()} />
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
          <StyledLoadingButton
            variant="outlined"
            onClick={onCopyCoordToPop}
            loading={copyingCoordToTpop}
            width={155}
          >
            Koordinaten auf die
            <br />
            Population kopieren
          </StyledLoadingButton>
        )}
        <StyledButton
          variant="outlined"
          onClick={onClickShowCoordOfTpopOnMapsZhCh}
          width={103}
        >
          zeige auf
          <br />
          maps.zh.ch
        </StyledButton>
        <StyledButton
          variant="outlined"
          onClick={onClickShowCoordOfTpopOnMapGeoAdminCh}
          width={146}
        >
          zeige auf
          <br />
          map.geo.admin.ch
        </StyledButton>
      </MenuBar>
      <MuiMenu
        id="tpopDelMenu"
        anchorEl={delMenuAnchorEl}
        open={delMenuOpen}
        onClose={() => setDelMenuAnchorEl(null)}
      >
        <MenuTitle>löschen?</MenuTitle>
        <MenuItem onClick={onClickDelete}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
    </ErrorBoundary>
  )
})
