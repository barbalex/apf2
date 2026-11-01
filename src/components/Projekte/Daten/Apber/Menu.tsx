import { apiInsert } from '../../../../modules/api.ts'
import { v7 as uuidv7 } from 'uuid'
import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaMinus, FaFilePdf } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { deleteModule } from '../../TreeContainer/DeleteDatasetModal/delete/index.ts'

import styles from '../../../shared/Files/Menu/index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

const iconStyle = { color: 'white' }

export const Menu = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, apberId } = useParams<{
    projId: string
    apId: string
    apberId: string
  }>()

  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    const newId = uuidv7()
    try {
      await apiInsert('apber', {
        id: newId,
        ap_id: apId as string,
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
      queryKey: [`treeApber`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    const id = newId
    void navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/AP-Berichte/${id}${search}`,
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
        table: 'apber',
        id: apberId ?? null,
        label: null,
        url: pathname.split('/').filter((p) => !!p),
        afterDeletionHook: () => {
          void tsQueryClient.invalidateQueries({
            queryKey: [`treeAp`],
          })
          void navigate(
            `/Daten/Projekte/${projId}/Arten/${apId}/AP-Berichte${search}`,
          )
        },
      },
    })

  const onClickPrint = () => navigate(`print${search}`)

  return (
    <ErrorBoundary>
      <MenuBar>
        <Tooltip title="Neuen AP-Bericht erstellen">
          <IconButton onClick={() => void onClickAdd()}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Löschen">
          <IconButton
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'apberDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Druckversion öffnen. Achtung: lädt sehr viele Daten, ist daher langsam und stresst den Server.">
          <IconButton onClick={() => void onClickPrint()}>
            <FaFilePdf style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
      <MuiMenu
        id="apberDelMenu"
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
