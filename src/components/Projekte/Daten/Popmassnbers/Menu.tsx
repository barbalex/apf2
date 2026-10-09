import { useSetAtom } from 'jotai'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import type { PopmassnberId, PopId } from '../../../../models/apflora/index.ts'

import { addNotificationAtom } from '../../../../store/index.ts'

interface CreatePopmassnberResult {
  createPopmassnber?: {
    popmassnber?: {
      id: PopmassnberId
      popId: PopId
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
  const { popId } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: { data?: CreatePopmassnberResult | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreatePopmassnberResult>({
        mutation: graphql(`
          mutation createPopmassnberForPopmassnbersForm($popId: UUID!) {
            createPopmassnber(input: { popmassnber: { popId: $popId } }) {
              popmassnber {
                id
                popId
              }
            }
          }
        `),
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
    void tsQueryClient.invalidateQueries({
      queryKey: [`treePopmassnber`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treePopFolders`],
    })
    const id = result?.data?.createPopmassnber?.popmassnber?.id
    void navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neuen Massnahmen-Bericht erstellen">
          <IconButton onClick={() => void onClickAdd()}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
}
