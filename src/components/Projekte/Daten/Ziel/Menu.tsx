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

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import type { ZielId } from '../../../../models/apflora/ZielId.ts'
import type { ApId } from '../../../../models/apflora/ApId.ts'

interface CreateZielResult {
  data: {
    createZiel: {
      ziel: {
        id: ZielId
        apId: ApId
      }
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
    let result: CreateZielResult | undefined
    try {
      result = await apolloClient.mutate<CreateZielResult['data']>({
        mutation: gql`
          mutation createZielForZielForm($apId: UUID!) {
            createZiel(input: { ziel: { apId: $apId } }) {
              ziel {
                id
                apId
              }
            }
          }
        `,
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
    tsQueryClient.invalidateQueries({
      queryKey: [`treeZiel`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeZieljahrs`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeZielsOfJahr`],
    })
    const id = result?.data?.createZiel?.ziel?.id
    navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}/${id}${search}`,
    )
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
          mutation deleteZiel($id: UUID!) {
            deleteZielById(input: { id: $id }) {
              ziel {
                id
              }
            }
          }
        `,
        variables: { id: zielId },
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
    tsQueryClient.invalidateQueries({
      queryKey: [`treeZiel`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeZieljahrs`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeZielsOfJahr`],
    })
    // navigate to parent
    navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}${search}`,
    )
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        <Tooltip title="Neues Ziel erstellen">
          <IconButton onClick={onClickAdd}>
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
        <MenuItem onClick={onClickDelete}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
    </ErrorBoundary>
  )
}
