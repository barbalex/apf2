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

import type { TpopkontrzaehlId } from '../../../../models/apflora/Tpopkontrzaehl.ts'
import type { TpopkontrId } from '../../../../models/apflora/Tpopkontr.ts'

import { addNotificationAtom } from '../../../../store/index.ts'

interface CreateTpopkontrzaehlResult {
  createTpopkontrzaehl: {
    tpopkontrzaehl: {
      id: TpopkontrzaehlId
      tpopkontrId: TpopkontrId
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
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()
  const { tpopkontrId } = useParams()

  const onClickAdd = async () => {
    let result: { data?: CreateTpopkontrzaehlResult | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreateTpopkontrzaehlResult>({
        mutation: graphql(`
          mutation createTpopkontrzaehlForTpopkontrzaehlsForm(
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
        variables: {
          tpopkontrId,
        },
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
    void navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue Zählung erstellen">
          <IconButton onClick={() => void onClickAdd()}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
}
