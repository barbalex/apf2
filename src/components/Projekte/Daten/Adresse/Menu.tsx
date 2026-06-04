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

import type { AdresseId } from '../../../../models/apflora/Adresse.ts'

import styles from '../../../shared/Files/Menu/index.module.css'

import {
  addNotificationAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../../store/index.ts'

interface CreateAdresseResult {
  data?: {
    createAdresse?: {
      adresse?: {
        id: AdresseId
      }
    }
  }
}

interface DeleteAdresseResult {
  data?: {
    deleteAdresseById?: {
      adresse?: {
        id: AdresseId
      }
    }
  }
}

const iconStyle = { color: 'white' }

export const Menu = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const { adrId } = useParams<{ adrId: string }>()
  const { search, pathname } = useLocation()
  const navigate = useNavigate()

  const onClickAdd = async () => {
    let result: CreateAdresseResult | undefined
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation createAdresseForAdresseForm {
            createAdresse(input: { adresse: {} }) {
              adresse {
                id
              }
            }
          }
        `,
      })
    } catch (error) {
      console.log('error:', error)
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: ['treeWerteFolders'],
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treeAdresse'],
    })
    const id = result?.data?.createAdresse?.adresse?.id
    navigate(`/Daten/Werte-Listen/Adressen/${id}${search}`)
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = async () => {
    let result: DeleteAdresseResult | undefined
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation deleteAdresse($id: UUID!) {
            deleteAdresseById(input: { id: $id }) {
              adresse {
                id
              }
            }
          }
        `,
        variables: { id: adrId },
      })
    } catch (error) {
      console.log('error:', error)
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
      queryKey: [`treeWerteFolders`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treeAdresse'],
    })
    // navigate to parent
    navigate(`/Daten/Werte-Listen/Adressen${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        <Tooltip title="Neue Adresse erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Löschen">
          <IconButton
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'adresseDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
      <MuiMenu
        id="adresseDelMenu"
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
