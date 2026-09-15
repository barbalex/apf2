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

import type { TpopkontrzaehlId } from '../../../../models/apflora/Tpopkontrzaehl.ts'
import type { TpopkontrId } from '../../../../models/apflora/Tpopkontr.ts'

import filesMenuStyles from '../../../shared/Files/Menu/index.module.css'

import {
  addNotificationAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../../store/index.ts'

interface CreateTpopkontrzaehlResult {
  createTpopkontrzaehl: {
    tpopkontrzaehl: {
      id: TpopkontrzaehlId
      tpopkontrId: TpopkontrId
    }
  }
}

const iconStyle = { color: 'white' }

export const Menu = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, popId, tpopId, tpopkontrId, tpopkontrzaehlId } =
    useParams()

  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: { data?: CreateTpopkontrzaehlResult | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreateTpopkontrzaehlResult>({
        mutation: graphql(`
          mutation createTpopkontrzaehlForTpopkontrzaehlForm(
            $tpopkontrId: UUID!
          ) {
            createTpopkontrzaehl(
              input: { tpopkontrzaehl: { tpopkontrId: $tpopkontrId } }
            ) {
              tpopkontrzaehl {
                id
                tpopkontrId
              }
            }
          }
        `),
        variables: { tpopkontrId },
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
      queryKey: [`treeTpopfeldkontrzaehl`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontrzaehlFolders`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontr`],
    })
    const id = result?.data?.createTpopkontrzaehl?.tpopkontrzaehl?.id
    void navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${tpopkontrId}/Zaehlungen/${id}${search}`,
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
          mutation deleteTpopkontrzaehl($id: UUID!) {
            deleteTpopkontrzaehlById(input: { id: $id }) {
              tpopkontrzaehl {
                id
              }
            }
          }
        `),
        variables: { id: tpopkontrzaehlId ?? '' },
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
      queryKey: [`treeTpopfeldkontrzaehl`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontrzaehlFolders`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontr`],
    })
    // navigate to parent
    void navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${tpopkontrId}/Zaehlungen${search}`,
    )
  }

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
            aria-owns={delMenuOpen ? 'tpopkontrzaehlDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
      <MuiMenu
        id="tpopkontrzaehlDelMenu"
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
