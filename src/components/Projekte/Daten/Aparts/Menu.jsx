import { memo, useCallback, useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import { MdContentCopy } from 'react-icons/md'
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
    const { apId } = useParams()

    const store = useContext(MobxContext)

    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await apolloClient.mutate({
          mutation: gql`
            mutation createApartForApartsForm($apId: UUID!) {
              createApart(input: { apart: { apId: $apId } }) {
                apart {
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
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }
      tsQueryClient.invalidateQueries({
        queryKey: [`treeApart`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeAp`],
      })
      const id = result?.data?.createApart?.apart?.id
      navigate(`./${id}${search}`)
    }, [apolloClient, store, tsQueryClient, navigate, search, apId])

    return (
      <ErrorBoundary>
        <MenuBar>
          {!!toggleFilterInput && (
            <FilterButton toggleFilterInput={toggleFilterInput} />
          )}
          <Tooltip title="Neues Taxon erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
