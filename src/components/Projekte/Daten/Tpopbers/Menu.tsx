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

import type { TpopId } from '../../../../models/apflora/index.ts'
import type { TpopberId } from '../../../../models/apflora/Tpopber.ts'

import {
  addNotificationAtom,
} from '../../../../store/index.ts'


interface CreateTpopberResult {
  createTpopber: {
    tpopber: {
      id: TpopberId
      tpopId: TpopId
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
    let result: { data?: CreateTpopberResult | null | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreateTpopberResult>({
        mutation: graphql(`
          mutation createTpopberForTpopbersForm($tpopId: UUID!) {
            createTpopber(input: { tpopber: { tpopId: $tpopId } }) {
              tpopber {
                id
                tpopId
              }
            }
          }
        `),
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
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopber`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    const id = result?.data?.createTpopber?.tpopber?.id
    void navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neuen Kontroll-Bericht erstellen">
          <IconButton onClick={() => void onClickAdd()}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
}
