import { memo, useCallback, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { LabelFilter, labelFilterWidth } from '../../../shared/LabelFilter.jsx'
import { listLabelFilterIsIconAtom } from '../../../../JotaiStore/index.js'

const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(() => {
    const { search } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { apId } = useParams()
    const store = useContext(StoreContext)

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createEkzaehleinheitForEkzaehleinheitsForm($apId: UUID!) {
              createEkzaehleinheit(input: { ekzaehleinheit: { apId: $apId } }) {
                ekzaehleinheit {
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
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeEkzaehleinheit`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      const id = result?.data?.createEkzaehleinheit?.ekzaehleinheit?.id
      navigate(`./${id}${search}`)
    }, [client, store, tanstackQueryClient, navigate, search, apId])

    const [labelFilterIsIcon] = useAtom(listLabelFilterIsIconAtom)

    return (
      <ErrorBoundary>
        <MenuBar>
          <LabelFilter
            width={labelFilterIsIcon ? buttonWidth : labelFilterWidth}
          />
          <Tooltip title="Neue EK-Zähleinheiten erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
