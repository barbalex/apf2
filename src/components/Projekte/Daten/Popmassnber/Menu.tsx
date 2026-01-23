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

import type { PopmassnberId, PopId } from '../../../../models/apflora/index.tsx'

import styles from '../../../shared/Files/Menu/index.module.css'

import {
  addNotificationAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../../JotaiStore/index.ts'

interface CreatePopmassnberResult {
  data?: {
    createPopmassnber?: {
      popmassnber?: {
        id: PopmassnberId
        popId: PopId
      }
    }
  }
}

const iconStyle = { color: 'white' }

export const Menu = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, popId, popmassnberId } = useParams()

  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: CreatePopmassnberResult | undefined
    try {
      result = await apolloClient.mutate<CreatePopmassnberResult>({
        mutation: gql`
          mutation createPopmassnberForPopmassnberForm($popId: UUID!) {
            createPopmassnber(input: { popmassnber: { popId: $popId } }) {
              popmassnber {
                id
                popId
              }
            }
          }
        `,
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
    tsQueryClient.invalidateQueries({
      queryKey: [`treePopmassnber`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treePopFolders`],
    })
    const id = result?.data?.createPopmassnber?.popmassnber?.id
    navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Massnahmen-Berichte/${id}${search}`,
    )
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = async () => {
    let result
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation deletePopmassnber($id: UUID!) {
            deletePopmassnberById(input: { id: $id }) {
              popmassnber {
                id
              }
            }
          }
        `,
        variables: { id: popmassnberId },
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
      queryKey: [`treePopmassnber`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treePopFolders`],
    })
    // navigate to parent
    navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Massnahmen-Berichte${search}`,
    )
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        <Tooltip title="Neuen Bericht erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Löschen">
          <IconButton
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'popmassnberDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
      <MuiMenu
        id="popmassnberDelMenu"
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
