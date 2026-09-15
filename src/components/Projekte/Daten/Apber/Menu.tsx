import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaMinus, FaFilePdf } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { isEqual } from 'es-toolkit'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import styles from '../../../shared/Files/Menu/index.module.css'

import {
  addNotificationAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../../store/index.ts'

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

  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result
    try {
      result = await apolloClient.mutate({
        mutation: graphql(`
          mutation createApberForApberForm($apId: UUID!) {
            createApber(input: { apber: { apId: $apId } }) {
              apber {
                id
                apId
              }
            }
          }
        `),
        variables: { apId: apId as string },
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
    const id = result?.data?.createApber?.apber?.id
    void navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/AP-Berichte/${id}${search}`,
    )
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = async () => {
    try {
      await apolloClient.mutate({
        mutation: graphql(`
          mutation deleteApber($id: UUID!) {
            deleteApberById(input: { id: $id }) {
              apber {
                id
              }
            }
          }
        `),
        variables: { id: apberId as string },
      })
    } catch (error) {
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
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeApber`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    // navigate to parent
    void navigate(`/Daten/Projekte/${projId}/Arten/${apId}/AP-Berichte${search}`)
  }

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
