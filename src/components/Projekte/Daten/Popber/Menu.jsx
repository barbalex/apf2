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
import styled from '@emotion/styled'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'

export const Menu = memo(
  observer(({ row }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, popId, popberId } = useParams()
    const store = useContext(StoreContext)

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createPopberForPopberForm($popId: UUID!) {
              createPopber(input: { popber: { popId: $popId } }) {
                popber {
                  id
                  popId
                }
              }
            }
          `,
          variables: { popId },
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
        queryKey: [`treePopber`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treePopFolders`],
      })
      const id = result?.data?.createPopber?.popber?.id
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Kontroll-Berichte/${id}${search}`,
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
    ])

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const onClickDelete = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation deletePopber($id: UUID!) {
              deletePopberById(input: { id: $id }) {
                popber {
                  id
                }
              }
            }
          `,
          variables: { id: popberId },
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
        queryKey: [`treePopber`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treePopFolders`],
      })
      // navigate to parent
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Kontroll-Berichte${search}`,
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
      popberId,
      pathname,
    ])

    return (
      <ErrorBoundary>
        <MenuBar>
          <IconButton
            title="Neuen Bericht erstellen"
            onClick={onClickAdd}
          >
            <FaPlus />
          </IconButton>
          <IconButton
            title="Löschen"
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'popberDelMenu' : undefined}
          >
            <FaMinus />
          </IconButton>
        </MenuBar>
        <MuiMenu
          id="popberDelMenu"
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