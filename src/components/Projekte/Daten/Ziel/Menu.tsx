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

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

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
  const { projId, apId, jahr, zielId } = useParams()

  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

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

  const onClickDelete = async () => {
    try {
      await apolloClient.mutate({
        mutation: graphql(`
          mutation deleteZiel($id: UUID!) {
            deleteZielById(input: { id: $id }) {
              ziel {
                id
              }
            }
          }
        `),
        variables: { id: zielId as string },
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
      queryKey: [`treeZiel`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeZieljahrs`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeZielsOfJahr`],
    })
    // navigate to parent
    void navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}${search}`,
    )
  }

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
