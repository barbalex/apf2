import { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
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
import LoadingButton from '@mui/lab/LoadingButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import isEqual from 'lodash/isEqual'
import uniq from 'lodash/uniq'
import styled from '@emotion/styled'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { isMobilePhone } from '../../../../modules/isMobilePhone.js'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { copyTpopKoordToPop } from '../../../../modules/copyTpopKoordToPop/index.js'
import { showCoordOfTpopOnMapGeoAdminCh } from '../../../../modules/showCoordOfTpopOnMapGeoAdminCh.js'
import { showCoordOfTpopOnMapsZhCh } from '../../../../modules/showCoordOfTpopOnMapsZhCh.js'

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
const StyledLoadingButton = styled(LoadingButton)`
  margin: 0 5px;
  padding: 3px 10px;
  text-transform: none;
  line-height: 1.1;
  font-size: 0.8rem;
  color: white;
  border-color: white;
  width: ${(props) => props.width}px;
`
const StyledButton = styled(Button)`
  margin: 0 5px;
  padding: 3px 10px;
  text-transform: none;
  line-height: 1.1;
  font-size: 0.8rem;
  max-height: 36px;
  color: white;
  border-color: white;
`
const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ row }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, popId, tpopId } = useParams()
    const store = useContext(StoreContext)
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

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
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
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpop`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treePopFolders`],
      })
      const id = result?.data?.createTpop?.tpop?.id
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${id}${search}`,
      )
    }, [
      apId,
      client,
      store,
      tanstackQueryClient,
      navigate,
      search,
      projId,
      popId,
      tpopId,
    ])

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const onClickDelete = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
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
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpop`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treePopFolders`],
      })
      // navigate to parent
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen${search}`,
      )
    }, [
      client,
      store,
      tanstackQueryClient,
      navigate,
      search,
      apId,
      projId,
      popId,
      tpopId,
      pathname,
    ])

    const onClickOpenLowerNodes = useCallback(() => {
      openLowerNodes({
        id: tpopId,
        projId,
        apId,
        popId,
        client,
        store,
        menuType: 'tpop',
        parentId: popId,
      })
    }, [projId, apId, popId, tpopId, client, store])

    const onClickCloseLowerNodes = useCallback(() => {
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
    }, [projId, apId, popId, tpopId, store, search])

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
    const isLocalizing = !!idOfTpopBeingLocalized
    const onClickLocalizeOnMap = useCallback(() => {
      if (isLocalizing) {
        return setIdOfTpopBeingLocalized(null)
      }
      setIdOfTpopBeingLocalized(tpopId)
      showMapIfNotYetVisible(projekteTabs)
      setActiveApfloraLayers(uniq([...activeApfloraLayers, 'tpop']))
    }, [
      setIdOfTpopBeingLocalized,
      tpopId,
      showMapIfNotYetVisible,
      projekteTabs,
      activeApfloraLayers,
      setActiveApfloraLayers,
      idOfTpopBeingLocalized,
    ])
    const isMoving =
      moving.id !== '99999999-9999-9999-9999-999999999999' &&
      moving.table === 'tpop'
    const thisTpopIsMoving = moving.id === tpopId
    const tpopMovingFromThisPop = moving.fromParentId === popId
    const onClickMoveInTree = useCallback(() => {
      setMoving({
        id: row.id,
        label: row.label,
        table: 'tpop',
        toTable: 'tpop',
        fromParentId: popId,
      })
    }, [row, setMoving, popId])

    const onClickStopMoving = useCallback(() => {
      setMoving({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        toTable: null,
        fromParentId: null,
      })
    }, [setMoving])

    // TODO: add this in pop
    const onClickMoveHere = useCallback(() => {
      moveTo({
        id: popId,
        client,
        store,
        tanstackQueryClient,
      })
    }, [client, store, popId])

    const isCopying =
      copying.id !== '99999999-9999-9999-9999-999999999999' &&
      !!copying.id &&
      copying.table === 'tpop'
    const thisTpopIsCopying = copying.id === tpopId

    const onClickCopy = useCallback(() => {
      if (isCopying) {
        // copy to this pop
        return copyTo({
          parentId: popId,
          client,
          store,
          tanstackQueryClient,
        })
      }
      setCopying({
        table: 'tpop',
        id: tpopId,
        label: row.label,
        withNextLevel: false,
      })
    }, [
      isCopying,
      copyTo,
      popId,
      tpopId,
      client,
      store,
      tanstackQueryClient,
      row,
      setCopying,
    ])

    const onClickStopCopying = useCallback(() => {
      setCopying({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        withNextLevel: false,
      })
    }, [setCopying])

    const tpopHasCoord = !!row.lv95X && !!row.lv95Y
    const [copyingCoordToTpop, setCopyingCoordToTpop] = useState(false)
    const onCopyCoordToPop = useCallback(async () => {
      setCopyingCoordToTpop(true)
      await copyTpopKoordToPop({ id: tpopId, store, client })
      setCopyingCoordToTpop(false)
    }, [tpopId, store, client])

    const widths = useMemo(
      () => [
        buttonWidth,
        buttonWidth,
        buttonWidth,
        buttonWidth,
        buttonWidth,
        buttonWidth,
        ...(isMoving ? [buttonWidth] : []),
        buttonWidth,
        ...(isCopying ? [buttonWidth] : []),
        ...(tpopHasCoord ? [180] : []),
      ],
      [isCopying, isMoving, tpopHasCoord],
    )

    const onClickShowCoordOfTpopOnMapGeoAdminCh = useCallback(() => {
      showCoordOfTpopOnMapGeoAdminCh({
        id: tpopId,
        client,
        enqueNotification: store.enqueNotification,
      })
    }, [tpopId, client, store])

    const onClickShowCoordOfTpopOnMapsZhCh = useCallback(() => {
      showCoordOfTpopOnMapsZhCh({
        id: tpopId,
        client,
        enqueNotification: store.enqueNotification,
      })
    }, [tpopId, client, store])

    return (
      <ErrorBoundary>
        <MenuBar
          bgColor="#388e3c"
          color="white"
          rerenderer={`${idOfTpopBeingLocalized}/${isMoving}/${isCopying}/${tpopMovingFromThisPop}/${thisTpopIsMoving}/${thisTpopIsCopying}/${copyingCoordToTpop}/${tpopHasCoord}`}
          widths={widths}
        >
          <IconButton
            title="Neue Teil-Population erstellen"
            onClick={onClickAdd}
          >
            <FaPlus style={iconStyle} />
          </IconButton>
          <IconButton
            title="Löschen"
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'tpopDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
          <IconButton
            title="Ordner im Navigationsbaum öffnen"
            onClick={onClickOpenLowerNodes}
          >
            <FaFolderTree style={iconStyle} />
          </IconButton>
          <IconButton
            title="Ordner im Navigationsbaum schliessen"
            onClick={onClickCloseLowerNodes}
          >
            <RiFolderCloseFill style={iconStyle} />
          </IconButton>
          <RoundToggleButton
            value={idOfTpopBeingLocalized ?? ''}
            title="Auf Karte verorten (mit Doppelklick)"
            onChange={onClickLocalizeOnMap}
            selected={isLocalizing}
          >
            <FaMapLocationDot style={iconStyle} />
          </RoundToggleButton>
          <IconButton
            title={
              !isMoving ?
                `'${row.label}' zu einer anderen Population verschieben`
              : thisTpopIsMoving ?
                'Zum Verschieben gemerkt, bereit um in einer anderen Population einzufügen'
              : tpopMovingFromThisPop ?
                `'${moving.label}' zur selben Population zu vershieben, macht keinen Sinn`
              : `Verschiebe '${moving.label}' zu dieser Population`
            }
            onClick={onClickMoveInTree}
          >
            <MoveIcon moving={(isMoving && thisTpopIsMoving).toString()} />
          </IconButton>
          {isMoving && (
            <IconButton
              title={`Verschieben von '${moving.label}' abbrechen`}
              onClick={onClickStopMoving}
            >
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          )}
          <IconButton
            title={
              isCopying ?
                `Kopiere '${copying.label}' in diese Population`
              : 'Kopieren'
            }
            onClick={onClickCopy}
          >
            <CopyIcon copying={thisTpopIsCopying.toString()} />
          </IconButton>
          {isCopying && (
            <IconButton
              title={`Kopieren von '${copying.label}' abbrechen`}
              onClick={onClickStopCopying}
            >
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          )}
          {tpopHasCoord && (
            <StyledLoadingButton
              variant="outlined"
              onClick={onCopyCoordToPop}
              loading={copyingCoordToTpop}
              width={180}
            >
              Koordinaten auf die Population übertragen
            </StyledLoadingButton>
          )}
          <StyledButton
            variant="outlined"
            style={{ width: 90 }}
            onClick={onClickShowCoordOfTpopOnMapsZhCh}
          >
            zeige auf maps.zh.ch
          </StyledButton>
          <StyledButton
            variant="outlined"
            style={{ width: 130 }}
            onClick={onClickShowCoordOfTpopOnMapGeoAdminCh}
          >
            zeige auf map.geo.admin.ch
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
  }),
)
