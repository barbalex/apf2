import { memo, useCallback, useContext, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import isEqual from 'lodash/isEqual'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'

export const Menu = memo(
  observer(({ row }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const queryClient = useQueryClient()
    const { projId, apId } = useParams()
    const store = useContext(StoreContext)

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createAssozartForAssozartForm($apId: UUID!) {
              createAssozart(input: { assozart: { apId: $apId } }) {
                assozart {
                  id
                  apId
                }
              }
            }
          `,
          variables: { apId },
        })
      } catch (error) {
        return store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }
      queryClient.invalidateQueries({
        queryKey: [`treeAssozart`],
      })
      queryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      const id = result?.data?.createAssozart?.assozart?.id
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/assoziierte-Arten/${id}${search}`,
      )
    }, [apId, client, store, queryClient, navigate, search, projId])

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const onClickDelete = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation deleteAssozart($id: UUID!) {
              deleteAssozartById(input: { id: $id }) {
                assozart {
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
      queryClient.invalidateQueries({
        queryKey: [`treeAssozart`],
      })
      queryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      // navigate to parent
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/assoziierte-Arten${search}`,
      )
    }, [
      client,
      store,
      queryClient,
      navigate,
      search,
      apId,
      projId,
      row,
      pathname,
    ])

    return (
      <ErrorBoundary>
        <MenuBar>
          <IconButton
            title="Neuen AP-Bericht erstellen"
            onClick={onClickAdd}
          >
            <FaPlus />
          </IconButton>
          <IconButton
            title="Löschen"
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'abperuebersichtDelMenu' : undefined}
          >
            <FaMinus />
          </IconButton>
        </MenuBar>
        <MuiMenu
          id="abperuebersichtDelMenu"
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
