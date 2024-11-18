import { memo, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'

const iconStyle = { color: 'white' }

export const Menu = memo(() => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const client = useApolloClient()
  const tanstackQueryClient = useQueryClient()
  const { apId } = useParams()

  const onClickAdd = useCallback(async () => {
    let result
    try {
      result = await client.mutate({
        mutation: gql`
          mutation createEkfrequenzForEkfrequenzForm($apId: UUID!) {
            createEkfrequenz(input: { ekfrequenz: { apId: $apId } }) {
              ekfrequenz {
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
      queryKey: [`treeEkfrequenz`],
    })
    tanstackQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    const id = result?.data?.createEkfrequenz?.ekfrequenz?.id
    navigate(`./${id}${search}`)
  }, [client, store, tanstackQueryClient, navigate, search, apId])

  return (
    <ErrorBoundary>
      <MenuBar
        bgColor="#388e3c"
        color="white"
      >
        <Tooltip title="Neue EK-Frequenz erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
