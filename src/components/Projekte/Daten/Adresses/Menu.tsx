import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { MobxContext } from '../../../../mobxContext.js'

import type { AdresseId } from '../../../../models/apflora/Adresse.js'

interface CreateAdresseResult {
  data?: {
    createAdresse?: {
      adresse?: {
        id: AdresseId
      }
    }
  }
}

const iconStyle = { color: 'white' }

interface MenuProps {
  toggleFilterInput?: () => void
}

export const Menu = observer(({ toggleFilterInput }: MenuProps) => {
  const { search, pathname } = useLocation()
  const navigate = useNavigate()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: CreateAdresseResult | undefined
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation createAdresseForAdressesForm {
            createAdresse(input: { adresse: {} }) {
              adresse {
                id
              }
            }
          }
        `,
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
      queryKey: [`treeAdresse`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    const id = result?.data?.createAdresse?.adresse?.id
    navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue Adresse erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
