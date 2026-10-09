import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { deleteModule } from '../../TreeContainer/DeleteDatasetModal/delete/index.ts'

import type { PopberId, PopId } from '../../../../models/apflora/index.ts'

import filesMenuStyles from '../../../shared/Files/Menu/index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface CreatePopberResult {
  createPopber?: {
    popber?: {
      id: PopberId
      popId: PopId
    }
  }
}

const iconStyle = { color: 'white' }

export const Menu = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, popId, popberId } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: { data?: CreatePopberResult | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreatePopberResult>({
        mutation: graphql(`
          mutation createPopberForPopberForm($popId: UUID!) {
            createPopber(input: { popber: { popId: $popId } }) {
              popber {
                id
                popId
              }
            }
          }
        `),
        variables: { popId },
      })
    } catch (error) {
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    void tsQueryClient.invalidateQueries({
      queryKey: [`treePopber`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treePopFolders`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treePop`],
    })
    const id = result?.data?.createPopber?.popber?.id
    void navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Kontroll-Berichte/${id}${search}`,
    )
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = () =>
    void deleteModule({
      search,
      toDelete: {
        table: 'popber',
        id: popberId ?? null,
        label: null,
        url: pathname.split('/').filter((p) => !!p),
        afterDeletionHook: () => {
          void tsQueryClient.invalidateQueries({
            queryKey: [`treePop`],
          })
          void navigate(
            `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Kontroll-Berichte${search}`,
          )
        },
      },
    })

  return (
    <ErrorBoundary>
      <MenuBar>
        <Tooltip title="Neuen Bericht erstellen">
          <IconButton onClick={() => void onClickAdd()}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Löschen">
          <IconButton
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'popberDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
      <MuiMenu
        id="popberDelMenu"
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
