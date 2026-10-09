import { useSetAtom } from 'jotai'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import type { AdresseId } from '../../../../models/apflora/Adresse.ts'

import { addNotificationAtom } from '../../../../store/index.ts'

interface CreateAdresseResult {
  createAdresse: {
    adresse: {
      id: AdresseId
    } | null
  } | null
}

const iconStyle = { color: 'white' }

interface MenuProps {
  toggleFilterInput?: () => void
}

export const Menu = ({ toggleFilterInput }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search } = useLocation()
  const navigate = useNavigate()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: { data?: CreateAdresseResult | null | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreateAdresseResult>({
        mutation: graphql(`
          mutation createAdresseForAdressesForm {
            createAdresse(input: { adresse: {} }) {
              adresse {
                id
              }
            }
          }
        `),
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
      queryKey: [`treeAdresse`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    const id = result?.data?.createAdresse?.adresse?.id
    void navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue Adresse erstellen">
          <IconButton onClick={() => void onClickAdd()}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
}
