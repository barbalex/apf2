import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { upperFirst } from 'es-toolkit'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { deleteModule } from '../../TreeContainer/DeleteDatasetModal/delete/index.ts'

import filesMenuStyles from '../../../shared/Files/Menu/index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

// key: create${typename}; value: { [table]: { id } }
type CreateWertResult = Record<string, Record<string, { id: string }>>

interface MenuProps {
  row: {
    id: string
  }
  table: string
}

const iconStyle = { color: 'white' }

export const Menu = ({ row, table }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const typename = upperFirst(table)
  const pathName =
    table === 'tpopApberrelevantGrundWerte' ? 'ApberrelevantGrundWerte'
    : table === 'ekAbrechnungstypWerte' ? 'EkAbrechnungstypWerte'
    : table === 'tpopkontrzaehlEinheitWerte' ? 'TpopkontrzaehlEinheitWerte'
    : 'uups'

  const onClickAdd = async () => {
    let result: { data?: CreateWertResult | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreateWertResult>({
        mutation: dynamicGql`
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
    void tsQueryClient.invalidateQueries({
      queryKey: [`tree${typename}`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeWerteFolders`],
    })
    const id = result?.data?.[`create${typename}`]?.[table]?.id
    void navigate(`/Daten/Werte-Listen/${pathName}/${id}${search}`)
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = () =>
    void deleteModule({
      search,
      toDelete: {
        table:
          table === 'tpopApberrelevantGrundWerte' ? (
            'tpop_apberrelevant_grund_werte'
          )
          : table === 'ekAbrechnungstypWerte' ? 'ek_abrechnungstyp_werte'
          : table === 'tpopkontrzaehlEinheitWerte' ? (
            'tpopkontrzaehl_einheit_werte'
          )
          : table,
        id: row.id,
        label: null,
        url: pathname.split('/').filter((p) => !!p),
        afterDeletionHook: () => {
          void navigate(`/Daten/Werte-Listen/${pathName}${search}`)
        },
      },
    })

  return (
    <ErrorBoundary>
      <MenuBar>
        <Tooltip title="Neuen Wert erstellen">
          <IconButton onClick={() => void onClickAdd()}>
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
        <MenuItem onClick={() => void onClickDelete()}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
    </ErrorBoundary>
  )
}
