import { memo, useCallback, useContext, useState } from 'react'
import { gql } from '@apollo/client';
import { useApolloClient } from "@apollo/client/react";
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { isEqual } from 'es-toolkit'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'

const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(() => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const queryClient = useQueryClient()
    const { projId, apId, zaehleinheitId } = useParams()
    const store = useContext(MobxContext)

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createEkzaehleinheitForEkzaehleinheitForm($apId: UUID!) {
              createEkzaehleinheit(input: { ekzaehleinheit: { apId: $apId } }) {
                ekzaehleinheit {
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
        queryKey: [`treeEkzaehleinheit`],
      })
      queryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      queryClient.invalidateQueries({
        queryKey: [`treeAp`],
      })
      const id = result?.data?.createEkzaehleinheit?.ekzaehleinheit?.id
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/EK-Zähleinheiten/${id}${search}`,
      )
    }, [apId, client, store, queryClient, navigate, search, projId])

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const onClickDelete = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation deleteEkzaehleinheitForEkzaehleinheitForm($id: UUID!) {
              deleteEkzaehleinheitById(input: { id: $id }) {
                ekzaehleinheit {
                  id
                }
              }
            }
          `,
          variables: { id: zaehleinheitId },
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
        queryKey: [`treeEkzaehleinheit`],
      })
      queryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      queryClient.invalidateQueries({
        queryKey: [`treeAp`],
      })
      // navigate to parent
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/EK-Zähleinheiten${search}`,
      )
    }, [
      client,
      store,
      queryClient,
      navigate,
      search,
      apId,
      projId,
      zaehleinheitId,
      pathname,
    ])

    return (
      <ErrorBoundary>
        <MenuBar>
          <Tooltip title="Neuen AP-Bericht erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Löschen">
            <IconButton
              onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
              aria-owns={delMenuOpen ? 'ekzaehleinheitDelMenu' : undefined}
            >
              <FaMinus style={iconStyle} />
            </IconButton>
          </Tooltip>
        </MenuBar>
        <MuiMenu
          id="ekzaehleinheitDelMenu"
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
