import { memo, useCallback, useContext, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import { MdOutlineMoveDown } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import isEqual from 'lodash/isEqual'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { Icon } from '@mui/material'
import { moveTo } from '../../../../modules/moveTo/index.js'

export const Menu = memo(
  observer(({ row }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId } = useParams()
    const store = useContext(StoreContext)

    const { setMoving, moving } = store
    const isMoving = moving.id !== '99999999-9999-9999-9999-999999999999'

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
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeAp`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeRoot`],
      })
      const id = result?.data?.createAp?.ap?.id
      navigate(`/Daten/Projekte/${projId}/Arten/${id}${search}`)
    }, [projId, client, store, tanstackQueryClient, navigate, search])

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
          variables: { id: row.id },
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
        queryKey: [`treeAp`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeRoot`],
      })
      // navigate to parent
      navigate(`/Daten/Projekte/${projId}/Arten${search}`)
    }, [
      client,
      store,
      tanstackQueryClient,
      navigate,
      search,
      projId,
      row,
      pathname,
    ])

    const onClickMoveHere = useCallback(() => {
      moveTo({
        id: apId,
        store,
        client,
        tanstackQueryClient,
      })
    }, [apId, store, client])

    return (
      <ErrorBoundary>
        <MenuBar
          rerenderer={`${isMoving}/${moving.moveToTable}/${moving.moveFromId}`}
        >
          <IconButton
            title="Neue Art erstellen"
            onClick={onClickAdd}
          >
            <FaPlus />
          </IconButton>
          <IconButton
            title="Löschen"
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'apDelMenu' : undefined}
          >
            <FaMinus />
          </IconButton>
          {isMoving &&
            moving.moveToTable === 'ap' &&
            moving.moveFromId !== apId && (
              <IconButton
                title={`Verschiebe ${moving.label} hierhin`}
                onClick={onClickMoveHere}
              >
                <MdOutlineMoveDown />
              </IconButton>
            )}
        </MenuBar>
        <MuiMenu
          id="apDelMenu"
          anchorEl={delMenuAnchorEl}
          open={delMenuOpen}
          onClose={() => setDelMenuAnchorEl(null)}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: 120,
            },
          }}
        >
          <MenuTitle>löschen?</MenuTitle>
          <MenuItem onClick={onClickDelete}>ja</MenuItem>
          <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
        </MuiMenu>
      </ErrorBoundary>
    )
  }),
)
