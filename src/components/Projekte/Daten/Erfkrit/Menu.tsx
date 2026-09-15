import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { isEqual } from 'es-toolkit'
import type { ErfkritId, ApId } from '../../../../models/apflora/index.ts'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import styles from '../../../shared/Files/Menu/index.module.css'

import {
  addNotificationAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../../store/index.ts'

interface CreateErfkritResult {
  createErfkrit?: {
    erfkrit?: {
      id: ErfkritId
      apId: ApId
    }
  }
}

const iconStyle = { color: 'white' }

export const Menu = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, erfkritId } = useParams()

  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: { data?: CreateErfkritResult | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreateErfkritResult>({
        mutation: graphql(`
          mutation createErfkritForErfkritForm($apId: UUID!) {
            createErfkrit(input: { erfkrit: { apId: $apId } }) {
              erfkrit {
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
      queryKey: [`treeErfkrit`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    const id = result?.data?.createErfkrit?.erfkrit?.id
    void navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/AP-Erfolgskriterien/${id}${search}`,
    )
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = async () => {
    try {
      await apolloClient.mutate({
        mutation: graphql(`
          mutation deleteErfkrit($id: UUID!) {
            deleteErfkritById(input: { id: $id }) {
              erfkrit {
                id
              }
            }
          }
        `),
        variables: { id: erfkritId as string },
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
      queryKey: [`treeErfkrit`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    // navigate to parent
    void navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/AP-Erfolgskriterien${search}`,
    )
  }

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
            aria-owns={delMenuOpen ? 'erfkritDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
      <MuiMenu
        id="erfkritDelMenu"
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
