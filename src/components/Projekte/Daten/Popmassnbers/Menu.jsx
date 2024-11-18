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
  const { popId } = useParams()

  const onClickAdd = useCallback(async () => {
    let result
    try {
      result = await client.mutate({
        mutation: gql`
          mutation createPopmassnberForPopmassnberForm($popId: UUID!) {
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
    tanstackQueryClient.invalidateQueries({
      queryKey: [`treePopmassnber`],
    })
    tanstackQueryClient.invalidateQueries({
      queryKey: [`treePopFolders`],
    })
    const id = result?.data?.createPopmassnber?.popmassnber?.id
    navigate(`./${id}${search}`)
  }, [client, store, tanstackQueryClient, navigate, search, popId])

  return (
    <ErrorBoundary>
      <MenuBar
        bgColor="#388e3c"
        color="white"
      >
        <Tooltip title="Neuen Kontroll-Bericht erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
