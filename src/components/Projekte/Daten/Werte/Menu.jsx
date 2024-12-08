import { memo, useCallback, useContext, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import isEqual from 'lodash/isEqual'
import upperFirst from 'lodash/upperFirst'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'

const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ row, table }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const queryClient = useQueryClient()
    const store = useContext(MobxContext)

    const typename = upperFirst(table)
    const pathName =
      table === 'tpopApberrelevantGrundWerte' ? 'ApberrelevantGrundWerte'
      : table === 'ekAbrechnungstypWerte' ? 'EkAbrechnungstypWerte'
      : table === 'tpopkontrzaehlEinheitWerte' ? 'TpopkontrzaehlEinheitWerte'
      : 'uups'

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation create${typename}For${typename}Form {
              create${typename}(
                input: { ${table}: {  } }
              ) {
                ${table} {
                  id
                }
              }
            }
          `,
        })
      } catch (error) {
        console.log('error', error)
        return store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }
      queryClient.invalidateQueries({
        queryKey: [`tree${typename}`],
      })
      queryClient.invalidateQueries({
        queryKey: [`treeWerteFolders`],
      })
      const id = result?.data?.[`create${typename}`]?.[table]?.id
      navigate(`/Daten/Werte-Listen/${pathName}/${id}${search}`)
    }, [client, store, queryClient, navigate, search, typename, table])

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const onClickDelete = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation delete${typename}($id: UUID!) {
              delete${typename}ById(input: { id: $id }) {
                ${table} {
                  id
                }
              }
            }
          `,
          variables: { id: row.id },
        })
      } catch (error) {
        console.log('error', error)
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
        queryKey: [`tree${typename}`],
      })
      queryClient.invalidateQueries({
        queryKey: [`treeWerteFolders`],
      })
      // navigate to parent
      navigate(`/Daten/Werte-Listen/${pathName}${search}`)
    }, [
      client,
      store,
      queryClient,
      navigate,
      row.id,
      pathname,
      search,
      table,
      typename,
    ])

    return (
      <ErrorBoundary>
        <MenuBar>
          <Tooltip title="Neuen Wert erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Löschen">
            <IconButton
              onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
              aria-owns={delMenuOpen ? 'wertDelMenu' : undefined}
            >
              <FaMinus style={iconStyle} />
            </IconButton>
          </Tooltip>
        </MenuBar>
        <MuiMenu
          id="wertDelMenu"
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
