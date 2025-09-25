import { memo, useCallback, useContext, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { RiFolderCloseFill } from 'react-icons/ri'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { isEqual } from 'es-toolkit'
import { useAtom } from 'jotai'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { showTreeMenusAtom } from '../../../../JotaiStore/index.js'

const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(() => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tsQueryClient = useQueryClient()
    const { projId, apId } = useParams()
    const store = useContext(MobxContext)

    const { setMoving, moving, copying, setCopying } = store
    const [showTreeMenus] = useAtom(showTreeMenusAtom)

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createApForApForm($projId: UUID!) {
              createAp(input: { ap: { projId: $projId } }) {
                ap {
                  id
                  projId
                }
              }
            }
          `,
          variables: { projId },
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
        queryKey: [`treeAp`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeRoot`],
      })
      const id = result?.data?.createAp?.ap?.id
      navigate(`/Daten/Projekte/${projId}/Arten/${id}/Art${search}`)
    }, [projId, client, store, tsQueryClient, navigate, search])

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const onClickDelete = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation deleteAp($id: UUID!) {
              deleteApById(input: { id: $id }) {
                ap {
                  id
                }
              }
            }
          `,
          variables: { id: apId },
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
        queryKey: [`treeAp`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeRoot`],
      })
      // navigate to parent
      navigate(`/Daten/Projekte/${projId}/Arten${search}`)
    }, [client, store, tsQueryClient, navigate, search, projId, apId, pathname])

    const onClickMoveHere = useCallback(() => {
      moveTo({
        id: apId,
        store,
        client,
      })
    }, [apId, store, client])

    const onClickStopMoving = useCallback(() => {
      setMoving({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        toTable: null,
        fromParentId: null,
      })
    }, [setMoving])

    const onClickCopyTo = useCallback(() => {
      copyTo({
        parentId: apId,
        client,
        store,
      })
    }, [apId, client, store])

    const onClickCloseLowerNodes = useCallback(() => {
      closeLowerNodes({
        url: ['Projekte', projId, 'Arten', apId],
        store,
        search,
      })
    }, [projId, apId, store, search])

    const onClickStopCopying = useCallback(() => {
      setCopying({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        withNextLevel: false,
      })
    }, [setCopying])

    const isMoving = !!moving.table
    const isCopying = !!copying.table

    return (
      <ErrorBoundary>
        <MenuBar rerenderer={`${moving.id}/${copying.id}`}>
          <Tooltip title="Neue Art erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Löschen">
            <IconButton
              onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
              aria-owns={delMenuOpen ? 'apDelMenu' : undefined}
            >
              <FaMinus style={iconStyle} />
            </IconButton>
          </Tooltip>
          {showTreeMenus && (
            <Tooltip title="Ordner im Navigationsbaum schliessen">
              <IconButton onClick={onClickCloseLowerNodes}>
                <RiFolderCloseFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {isMoving &&
            moving.toTable === 'ap' &&
            moving.fromParentId !== apId && (
              <Tooltip title={`Verschiebe ${moving.label} zu dieser Art`}>
                <IconButton onClick={onClickMoveHere}>
                  <MdOutlineMoveDown style={iconStyle} />
                </IconButton>
              </Tooltip>
            )}
          {isMoving && (
            <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
              <IconButton onClick={onClickStopMoving}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {isCopying && (
            <Tooltip title={`Kopiere '${copying.label}' in diese Art`}>
              <IconButton onClick={onClickCopyTo}>
                <MdContentCopy style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {isCopying && (
            <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
              <IconButton onClick={onClickStopCopying}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
        </MenuBar>
        <MuiMenu
          id="apDelMenu"
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
