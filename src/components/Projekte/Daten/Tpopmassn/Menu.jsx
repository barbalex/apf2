import { memo, useCallback, useContext, useState } from 'react'
import { gql } from '@apollo/client';
import { useApolloClient } from "@apollo/client/react";
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { isEqual } from 'es-toolkit'
import styled from '@emotion/styled'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { moveTo } from '../../../../modules/moveTo/index.js'

const MoveIcon = styled(MdOutlineMoveDown)`
  color: ${(props) =>
    props.moving === 'true' ? 'rgb(255, 90, 0) !important' : 'white'};
`
const CopyIcon = styled(MdContentCopy)`
  color: ${(props) =>
    props.copying === 'true' ? 'rgb(255, 90, 0) !important' : 'white'};
`
const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ row }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, popId, tpopId, tpopmassnId } = useParams()
    const store = useContext(MobxContext)
    const { moving, setMoving, copying, setCopying } = store

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createTpopmassnForTpopmassnForm($tpopId: UUID!) {
              createTpopmassn(input: { tpopmassn: { tpopId: $tpopId } }) {
                tpopmassn {
                  id
                  tpopId
                }
              }
            }
          `,
          variables: {
            tpopId,
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
        queryKey: [`treeTpopmassn`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpop`],
      })
      const id = result?.data?.createTpopmassn?.tpopmassn?.id
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen/${id}${search}`,
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
            mutation deleteTpopmassn($id: UUID!) {
              deleteTpopmassnById(input: { id: $id }) {
                tpopmassn {
                  id
                }
              }
            }
          `,
          variables: { id: tpopmassnId },
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
        queryKey: [`treeTpopmassn`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpop`],
      })
      // navigate to parent
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen${search}`,
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

    const isMovingTpopmassn = moving.table === 'tpopmassn'
    const thisTpopmassnIsMoving = moving.id === tpopmassnId
    const movingFromThisTpop = moving.fromParentId === tpopId
    const onClickMoveInTree = useCallback(() => {
      if (isMovingTpopmassn) {
        return moveTo({
          id: tpopId,
          client,
          store,
          tanstackQueryClient,
        })
      }
      setMoving({
        id: row.id,
        label: row.label,
        table: 'tpopmassn',
        toTable: 'tpopmassn',
        fromParentId: tpopId,
      })
    }, [row, setMoving, tpopId, moveTo, client, store, tanstackQueryClient])

    const onClickStopMoving = useCallback(() => {
      setMoving({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        toTable: null,
        fromParentId: null,
      })
    }, [setMoving])

    const isCopyingTpopmassn = copying.table === 'tpopmassn'
    const thisTpopmassnIsCopying = copying.id === tpopmassnId
    const onClickCopy = useCallback(() => {
      if (isCopyingTpopmassn) {
        // copy to this tpop
        return copyTo({
          parentId: tpopId,
          client,
          store,
          tanstackQueryClient,
        })
      }
      setCopying({
        table: 'tpopmassn',
        id: tpopmassnId,
        label: row.label,
        withNextLevel: false,
      })
    }, [
      isCopyingTpopmassn,
      copyTo,
      tpopId,
      tpopmassnId,
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

    return (
      <ErrorBoundary>
        <MenuBar
          rerenderer={`${isMovingTpopmassn}/${moving.label}/${isCopyingTpopmassn}/${copying.label}/${movingFromThisTpop}/${thisTpopmassnIsMoving}/${thisTpopmassnIsCopying}`}
        >
          <Tooltip title="Neue Massnahme erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Löschen">
            <IconButton
              onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
              aria-owns={delMenuOpen ? 'tpopmassnDelMenu' : undefined}
            >
              <FaMinus style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              !isMovingTpopmassn ?
                `'${row.label}' zu einer anderen Teil-Population verschieben`
              : thisTpopmassnIsMoving ?
                'Zum Verschieben gemerkt, bereit um in einer anderen Teil-Population einzufügen'
              : movingFromThisTpop ?
                `'${moving.label}' zur selben Teil-Population zu vershieben, macht keinen Sinn`
              : `Verschiebe '${moving.label}' zu dieser Teil-Population`
            }
          >
            <IconButton onClick={onClickMoveInTree}>
              <MoveIcon
                moving={(isMovingTpopmassn && thisTpopmassnIsMoving).toString()}
              />
            </IconButton>
          </Tooltip>
          {isMovingTpopmassn && (
            <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
              <IconButton onClick={onClickStopMoving}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip
            title={
              isCopyingTpopmassn ?
                `Kopiere '${copying.label}' in diese Teilpopulation`
              : 'Kopieren'
            }
          >
            <IconButton onClick={onClickCopy}>
              <CopyIcon copying={thisTpopmassnIsCopying.toString()} />
            </IconButton>
          </Tooltip>
          {isCopyingTpopmassn && (
            <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
              <IconButton onClick={onClickStopCopying}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
        </MenuBar>
        <MuiMenu
          id="tpopmassnDelMenu"
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
