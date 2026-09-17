import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaFolderTree } from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useSetAtom, useAtomValue } from 'jotai'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.ts'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.ts'
import {
  showTreeMenusAtom,
  addNotificationAtom,
} from '../../../../store/index.ts'

import type { ZielId, ApId } from '../../../../models/apflora/index.ts'

interface CreateZielResult {
  createZiel: {
    ziel: {
      id: ZielId
      apId: ApId
    }
  }
}

interface MenuProps {
  toggleFilterInput?: () => void
}

const iconStyle = { color: 'white' }

export const Menu = ({ toggleFilterInput }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, jahr } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: { data?: CreateZielResult | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreateZielResult>({
        mutation: graphql(`
          mutation createZielForZielsForm($apId: UUID!) {
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
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    const id = result?.data?.createZiel?.ziel?.id
    void navigate(`./${id}${search}`)
  }

  const onClickOpenLowerNodes = () =>
    openLowerNodes({
      id: apId,
      projId,
      apId,
      parentId: apId,
      jahr,
      menuType: 'zieljahrFolder',
    })

  const onClickCloseLowerNodes = () =>
    closeLowerNodes({
      url: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', Number(jahr)],
      search,
    })

  const showTreeMenus = useAtomValue(showTreeMenusAtom)

  return (
    <ErrorBoundary>
      <MenuBar rerenderer={`${showTreeMenus}`}>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neues Ziel erstellen">
          <IconButton onClick={() => void onClickAdd()}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        {showTreeMenus && (
          <Tooltip title="Ordner im Navigationsbaum öffnen">
            <IconButton onClick={() => void onClickOpenLowerNodes()}>
              <FaFolderTree style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {showTreeMenus && (
          <Tooltip title="Ordner im Navigationsbaum schliessen">
            <IconButton onClick={() => void onClickCloseLowerNodes()}>
              <RiFolderCloseFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
      </MenuBar>
    </ErrorBoundary>
  )
}
