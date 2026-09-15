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

import type { AdresseId } from '../../../../models/apflora/Adresse.ts'

import styles from '../../../shared/Files/Menu/index.module.css'

import {
  addNotificationAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../../store/index.ts'

interface CreateAdresseResult {
  createAdresse: {
    adresse: {
      id: AdresseId
    } | null
  } | null
}

interface DeleteAdresseResult {
  deleteAdresseById: {
    adresse: {
      id: AdresseId
    } | null
  } | null
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
    let result: { data?: CreateAdresseResult | null | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreateAdresseResult>({
        mutation: graphql(`
          mutation createAdresseForAdresseForm {
            createAdresse(input: { adresse: {} }) {
              adresse {
                id
              }
            }
          }
        `),
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
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeWerteFolders'],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeAdresse'],
    })
    const id = result?.data?.createAdresse?.adresse?.id
    void navigate(`/Daten/Werte-Listen/Adressen/${id}${search}`)
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = async () => {
    try {
      await apolloClient.mutate<DeleteAdresseResult>({
        mutation: graphql(`
          mutation deleteAdresse($id: UUID!) {
            deleteAdresseById(input: { id: $id }) {
              adresse {
                id
              }
            }
          }
        `),
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
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeWerteFolders`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeAdresse'],
    })
    // navigate to parent
    void navigate(`/Daten/Werte-Listen/Adressen${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        <Tooltip title="Neue Adresse erstellen">
          <IconButton onClick={() => void onClickAdd()}>
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
        <MenuItem onClick={() => void onClickDelete()}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
    </ErrorBoundary>
  )
}
