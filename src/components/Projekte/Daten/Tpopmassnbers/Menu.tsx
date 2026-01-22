import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import type { TpopmassnberId } from '../../../../models/apflora/TpopmassnberId.ts'
import type { TpopId } from '../../../../models/apflora/TpopId.ts'

import {
  addNotificationAtom,
} from '../../../../JotaiStore/index.ts'


interface CreateTpopmassnberResult {
  data: {
    createTpopmassnber: {
      tpopmassnber: {
        id: TpopmassnberId
        tpopId: TpopId
      }
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
  const { tpopId } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: CreateTpopmassnberResult | undefined
    try {
      result = await apolloClient.mutate<CreateTpopmassnberResult['data']>({
        mutation: gql`
          mutation createTpopmassnberForTpopmassnbersForm($tpopId: UUID!) {
            createTpopmassnber(input: { tpopmassnber: { tpopId: $tpopId } }) {
              tpopmassnber {
                id
                tpopId
              }
            }
          }
        `,
        variables: { tpopId },
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
      queryKey: [`treeTpopmassnber`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    const id = result?.data?.createTpopmassnber?.tpopmassnber?.id
    navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neuen Massnahmen-Bericht erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
