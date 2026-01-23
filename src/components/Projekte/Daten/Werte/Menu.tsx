import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { isEqual } from 'es-toolkit'
import { upperFirst } from 'es-toolkit'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import filesMenuStyles from '../../../shared/Files/Menu/index.module.css'

import {
  addNotificationAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../../JotaiStore/index.ts'

interface MenuProps {
  row: {
    id: string
    [key: string]: any
  }
  table: string
}

const iconStyle = { color: 'white' }

export const Menu = ({ row, table }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()

  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const typename = upperFirst(table)
  const pathName =
    table === 'tpopApberrelevantGrundWerte' ? 'ApberrelevantGrundWerte'
    : table === 'ekAbrechnungstypWerte' ? 'EkAbrechnungstypWerte'
    : table === 'tpopkontrzaehlEinheitWerte' ? 'TpopkontrzaehlEinheitWerte'
    : 'uups'

  const onClickAdd = async () => {
    let result
    try {
      result = await apolloClient.mutate({
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
      return addNotification({
        message: (error as Error).message,
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
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = async () => {
    let result
    try {
      result = await apolloClient.mutate({
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
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }

    // remove active path from openNodes
    const activePath = pathname.split('/').filter((p) => !!p)
    const newOpenNodes = openNodes.filter((n) => !isEqual(n, activePath))
    setOpenNodes(newOpenNodes)

    // update tree query
    tsQueryClient.invalidateQueries({
      queryKey: [`tree${typename}`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeWerteFolders`],
    })
    // navigate to parent
    navigate(`/Daten/Werte-Listen/${pathName}${search}`)
  }

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
        <h3 className={filesMenuStyles.menuTitle}>löschen?</h3>
        <MenuItem onClick={onClickDelete}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
    </ErrorBoundary>
  )
}
