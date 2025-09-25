import { memo, useCallback, useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'

const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ toggleFilterInput }) => {
    const { search } = useLocation()
    const navigate = useNavigate()
    const { popId } = useParams()

    const store = useContext(MobxContext)

    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await apolloClient.mutate({
          mutation: gql`
            mutation createPopmassnberForPopmassnbersForm($popId: UUID!) {
              createPopmassnber(input: { popmassnber: { popId: $popId } }) {
                popmassnber {
                  id
                  popId
                }
              }
            }
          `,
          variables: { popId },
        })
      } catch (error) {
        return store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }
      tsQueryClient.invalidateQueries({
        queryKey: [`treePopmassnber`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treePopFolders`],
      })
      const id = result?.data?.createPopmassnber?.popmassnber?.id
      navigate(`./${id}${search}`)
    }, [apolloClient, store, tsQueryClient, navigate, search, popId])

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
  }),
)
