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

import type { ZielId, ApId } from '../../../../models/apflora/index.ts'

interface CreateZielResult {
  createZiel?: {
    ziel?: {
      id: ZielId
      apId: ApId
    }
  }
}

import styles from '../../../shared/Files/Menu/index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

const iconStyle = { color: 'white' }

export const Menu = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, jahr, zielId } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: { data?: CreateZielResult | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreateZielResult>({
        mutation: graphql(`
          mutation createZielForZielForm($apId: UUID!) {
            createZiel(input: { ziel: { apId: $apId } }) {
              ziel {
                id
                apId
              }
            }
          }
        `),
        variables: { apId },
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
      queryKey: [`treeZiel`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeZieljahrs`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeZielsOfJahr`],
    })
    const id = result?.data?.createZiel?.ziel?.id
    void navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}/${id}${search}`,
    )
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = () =>
    void deleteModule({
      search,
      toDelete: {
        table: 'ziel',
        id: zielId ?? null,
        label: null,
        url: pathname.split('/').filter((p) => !!p),
        afterDeletionHook: null,
      },
    })

  return (
    <ErrorBoundary>
      <MenuBar>
        <Tooltip title="Neues Ziel erstellen">
          <IconButton onClick={() => void onClickAdd()}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Löschen">
          <IconButton
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'zielDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
      <MuiMenu
        id="zielDelMenu"
        anchorEl={delMenuAnchorEl}
        open={delMenuOpen}
        onClose={() => setDelMenuAnchorEl(null)}
      >
        <h3 className={styles.menuTitle}>löschen?</h3>
        <MenuItem onClick={() => void onClickDelete()}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
    </ErrorBoundary>
  )
}
