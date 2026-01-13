import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { FaPlus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'

import type { TpopkontrzaehlId } from '../../../../models/apflora/TpopkontrzaehlId.ts'
import type { TpopkontrId } from '../../../../models/apflora/TpopkontrId.ts'

interface CreateTpopkontrzaehlResult {
  data: {
    createTpopkontrzaehl: {
      tpopkontrzaehl: {
        id: TpopkontrzaehlId
        tpopkontrId: TpopkontrId
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
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()
  const { tpopkontrId } = useParams()
  const store = useContext(MobxContext)

  const onClickAdd = async () => {
    let result: CreateTpopkontrzaehlResult | undefined
    try {
      result = await apolloClient.mutate<CreateTpopkontrzaehlResult['data']>({
        mutation: gql`
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
        `,
        variables: {
          tpopkontrId,
        },
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
      queryKey: [`treeTpopfeldkontrzaehl`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontrzaehlFolders`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontr`],
    })
    const id = result?.data?.createTpopkontrzaehl?.tpopkontrzaehl?.id
    navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue Zählung erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
