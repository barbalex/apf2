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
import { upperFirst } from 'es-toolkit'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'

const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ row, table }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tsQueryClient = useQueryClient()
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
      tsQueryClient.invalidateQueries({
        queryKey: [`tree${typename}`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeWerteFolders`],
      })
      const id = result?.data?.[`create${typename}`]?.[table]?.id
      navigate(`/Daten/Werte-Listen/${pathName}/${id}${search}`)
    }, [client, store, tsQueryClient, navigate, search, typename, table])

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
      tsQueryClient.invalidateQueries({
        queryKey: [`tree${typename}`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeWerteFolders`],
      })
      // navigate to parent
      navigate(`/Daten/Werte-Listen/${pathName}${search}`)
    }, [
      client,
      store,
      tsQueryClient,
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
