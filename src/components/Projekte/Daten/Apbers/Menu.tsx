import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { MobxContext } from '../../../../mobxContext.ts'

import type { ApberId } from '../../../../models/apflora/Apber.ts'
import type { ApId } from '../../../../models/apflora/Ap.ts'

import {
  store as jotaiStore,
  enqueNotificationAtom,
} from '../../../../JotaiStore/index.ts'
interface CreateApberResult {
  data?: {
    createApber?: {
      apber?: {
        id: ApberId
        apId: ApId
      }
    }
  }
}

interface MenuProps {
  toggleFilterInput?: () => void
}

const iconStyle = { color: 'white' }

export const Menu = observer(({ toggleFilterInput }: MenuProps) => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { apId } = useParams<{ apId: string }>()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: CreateApberResult | undefined
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation createApberForApbersForm($apId: UUID!) {
            createApber(input: { apber: { apId: $apId } }) {
              apber {
                id
                apId
              }
            }
          }
        `,
        variables: { apId },
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
      queryKey: [`treeApber`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    const id = result?.data?.createApber?.apber?.id
    navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neuen AP-Bericht erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
