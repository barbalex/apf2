import { memo, useCallback, useContext, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import { MdPrint } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import isEqual from 'lodash/isEqual'
import styled from '@emotion/styled'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'

const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ row }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, popId, tpopId, tpopkontrId } = useParams()
    const store = useContext(StoreContext)
    const { setIsPrint } = store

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createTpopkontrForTpopfreiwkontrForm(
              $tpopId: UUID!
              $typ: String!
            ) {
              createTpopkontr(
                input: { tpopkontr: { tpopId: $tpopId, typ: $typ } }
              ) {
                tpopkontr {
                  id
                  tpopId
                  typ
                }
              }
            }
          `,
          variables: { tpopId, typ: 'Freiwilligen-Erfolgskontrolle' },
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
        queryKey: [`treeTpopfreiwkontr`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopFolders`],
      })
      const id = result?.data?.createTpopkontr?.tpopkontr?.id
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen/${id}${search}`,
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
            mutation deleteTpopkontr($id: UUID!) {
              deleteTpopkontrById(input: { id: $id }) {
                tpopkontr {
                  id
                }
              }
            }
          `,
          variables: { id: tpopkontrId },
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
        queryKey: [`treeTpopfreiwkontr`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopFolders`],
      })
      // navigate to parent
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen${search}`,
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

    const onClickPrint = useCallback(() => {
      setIsPrint(true)
      // wait for file to load
      // https://github.com/barbalex/apf2/issues/617
      setTimeout(() => {
        window.print()
        setIsPrint(false)
      }, 0)
    }, [setIsPrint])

    return (
      <ErrorBoundary>
        <MenuBar
          bgColor="#388e3c"
          color="white"
        >
          <IconButton
            title="Neuen Bericht erstellen"
            onClick={onClickAdd}
          >
            <FaPlus style={iconStyle} />
          </IconButton>
          <IconButton
            title="Löschen"
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'tpopfreiwkontrDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
          <IconButton
            onClick={onClickPrint}
            title="drucken"
          >
            <MdPrint style={iconStyle} />
          </IconButton>
        </MenuBar>
        <MuiMenu
          id="tpopfreiwkontrDelMenu"
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
