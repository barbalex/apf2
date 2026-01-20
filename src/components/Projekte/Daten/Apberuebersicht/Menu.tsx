import { useContext, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus, FaFilePdf } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { isEqual } from 'es-toolkit'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { MobxContext } from '../../../../mobxContext.ts'

import type { ApberuebersichtId } from '../../../../models/apflora/Apberuebersicht.ts'
import type { ProjId } from '../../../../models/apflora/Proj.ts'

import styles from '../../../shared/Files/Menu/index.module.css'

import {
  store as jotaiStore,
  enqueNotificationAtom,
} from '../../../../JotaiStore/index.ts'
interface CreateApberuebersichtResult {
  data?: {
    createApberuebersicht?: {
      apberuebersicht?: {
        id: ApberuebersichtId
        projId: ProjId
      }
    }
  }
}

interface DeleteApberuebersichtResult {
  data?: {
    deleteApberuebersichtById?: {
      apberuebersicht?: {
        id: ApberuebersichtId
      }
    }
  }
}

const iconStyle = { color: 'white' }

export const Menu = observer(() => {
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apberuebersichtId } = useParams<{
    projId: string
    apberuebersichtId: string
  }>()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: CreateApberuebersichtResult | undefined
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation createApberuebersichtForApberuebersichtForm($projId: UUID!) {
            createApberuebersicht(
              input: { apberuebersicht: { projId: $projId } }
            ) {
              apberuebersicht {
                id
                projId
              }
            }
          }
        `,
        variables: { projId },
      })
    } catch (error) {
      return jotaiStore.set(enqueNotificationAtom, {
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: [`treeApberuebersicht`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    const id = result?.data?.createApberuebersicht?.apberuebersicht?.id
    navigate(`/Daten/Projekte/${projId}/AP-Berichte/${id}${search}`)
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = async () => {
    let result: DeleteApberuebersichtResult | undefined
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation deleteApberuebersicht($id: UUID!) {
            deleteApberuebersichtById(input: { id: $id }) {
              apberuebersicht {
                id
              }
            }
          }
        `,
        variables: { id: apberuebersichtId },
      })
    } catch (error) {
      return jotaiStore.set(enqueNotificationAtom, {
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }

    // remove active path from openNodes
    const openNodesRaw = store?.tree?.openNodes
    const openNodes = getSnapshot(openNodesRaw)
    const activePath = pathname.split('/').filter((p) => !!p)
    const newOpenNodes = openNodes.filter((n) => !isEqual(n, activePath))
    store.tree.setOpenNodes(newOpenNodes)

    // update tree query
    tsQueryClient.invalidateQueries({
      queryKey: [`treeApberuebersicht`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    // navigate to parent
    navigate(`/Daten/Projekte/${projId}/AP-Berichte${search}`)
  }

  // TODO?
  // store.setPrintingJberYear
  const onClickPrint = () => navigate(`print${search}`)

  return (
    <ErrorBoundary>
      <MenuBar>
        <Tooltip title="Neuen AP-Bericht erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Löschen">
          <IconButton
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'abperuebersichtDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Druckversion öffnen. Achtung: lädt sehr viele Daten, ist daher langsam und stresst den Server.">
          <IconButton onClick={onClickPrint}>
            <FaFilePdf style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
      <MuiMenu
        id="abperuebersichtDelMenu"
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
})
