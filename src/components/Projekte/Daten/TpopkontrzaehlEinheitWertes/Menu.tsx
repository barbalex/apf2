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

import { addNotificationAtom } from '../../../../store/index.ts'

interface CreateTpopkontrzaehlEinheitWerteResult {
  createTpopkontrzaehlEinheitWerte: {
    tpopkontrzaehlEinheitWerte: {
      id: string
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

  const onClickAdd = async () => {
    let result:
      | { data?: CreateTpopkontrzaehlEinheitWerteResult | undefined }
      | undefined
    try {
      result = await apolloClient.mutate<CreateTpopkontrzaehlEinheitWerteResult>(
        {
          mutation: graphql(`
          mutation createTpopkontrzaehlEinheitWerteForTpopkontrzaehlEinheitWerteForm {
            createTpopkontrzaehlEinheitWerte(
              input: { tpopkontrzaehlEinheitWerte: {} }
            ) {
              tpopkontrzaehlEinheitWerte {
                id
              }
            }
          }
        `),
        },
      )
    } catch (error) {
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopkontrzaehlEinheitWerte`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    const id =
      result?.data?.createTpopkontrzaehlEinheitWerte?.tpopkontrzaehlEinheitWerte
        ?.id
    void navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue Zähl-Einheit erstellen">
          <IconButton onClick={() => void onClickAdd()}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
}
