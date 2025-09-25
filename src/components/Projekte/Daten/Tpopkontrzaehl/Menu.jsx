import { memo, useCallback, useContext, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
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
import styled from '@emotion/styled'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'

const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(() => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const { projId, apId, popId, tpopId, tpopkontrId, tpopkontrzaehlId } =
      useParams()

    const store = useContext(MobxContext)

    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await apolloClient.mutate({
          mutation: gql`
            mutation createTpopkontrzaehlForTpopkontrzaehlForm(
              $tpopkontrId: UUID!
            ) {
              createTpopkontrzaehl(
                input: { tpopkontrzaehl: { tpopkontrId: $tpopkontrId } }
              ) {
                tpopkontrzaehl {
                  id
                  tpopkontrId
                }
              }
            }
          `,
          variables: { tpopkontrId },
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
        queryKey: [`treeTpopfeldkontrzaehl`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpopfeldkontrzaehlFolders`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpopfeldkontr`],
      })
      const id = result?.data?.createTpopkontrzaehl?.tpopkontrzaehl?.id
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${tpopkontrId}/Zaehlungen/${id}${search}`,
      )
    }, [
      apId,
      apolloClient,
      store,
      tsQueryClient,
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
        result = await apolloClient.mutate({
          mutation: gql`
            mutation deleteTpopkontrzaehl($id: UUID!) {
              deleteTpopkontrzaehlById(input: { id: $id }) {
                tpopkontrzaehl {
                  id
                }
              }
            }
          `,
          variables: { id: tpopkontrzaehlId },
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
        queryKey: [`treeTpopfeldkontrzaehl`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpopfeldkontrzaehlFolders`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpopfeldkontr`],
      })
      // navigate to parent
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${tpopkontrId}/Zaehlungen${search}`,
      )
    }, [
      apolloClient,
      store,
      tsQueryClient,
      navigate,
      search,
      apId,
      projId,
      popId,
      tpopId,
      pathname,
    ])

    return (
      <ErrorBoundary>
        <MenuBar>
          <Tooltip title="Neuen Bericht erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Löschen">
            <IconButton
              onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
              aria-owns={delMenuOpen ? 'tpopkontrzaehlDelMenu' : undefined}
            >
              <FaMinus style={iconStyle} />
            </IconButton>
          </Tooltip>
        </MenuBar>
        <MuiMenu
          id="tpopkontrzaehlDelMenu"
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
