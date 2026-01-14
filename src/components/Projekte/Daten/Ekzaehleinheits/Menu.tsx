import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'
import type {
  EkzaehleinheitId,
  ApId,
} from '../../../../models/apflora/index.js'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { MobxContext } from '../../../../mobxContext.js'

interface CreateEkzaehleinheitResult {
  data?: {
    createEkzaehleinheit?: {
      ekzaehleinheit?: {
        id: EkzaehleinheitId
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
  const { apId } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: CreateEkzaehleinheitResult | undefined
    try {
      result = await apolloClient.mutate<CreateEkzaehleinheitResult>({
        mutation: gql`
          mutation createEkzaehleinheitForEkzaehleinheitsForm($apId: UUID!) {
            createEkzaehleinheit(input: { ekzaehleinheit: { apId: $apId } }) {
              ekzaehleinheit {
                id
                apId
              }
            }
          }
        `,
        variables: { apId },
      })
    } catch (error) {
      return store.enqueNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: [`treeEkzaehleinheit`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    const id = result?.data?.createEkzaehleinheit?.ekzaehleinheit?.id
    navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue EK-Zähleinheiten erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
