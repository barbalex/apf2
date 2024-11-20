import { memo, useCallback, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { FaPlus, FaFolderTree } from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'

const iconStyle = { color: 'white' }

export const Menu = memo(() => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const client = useApolloClient()
  const tanstackQueryClient = useQueryClient()
  const { projId, apId } = useParams()

  const onClickAdd = useCallback(async () => {
    let result
    try {
      result = await client.mutate({
        mutation: gql`
          mutation createZielForZielForm($apId: UUID!) {
            createZiel(input: { ziel: { apId: $apId, jahr: 1 } }) {
              ziel {
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
      queryKey: [`treeZiel`],
    })
    tanstackQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    const id = result?.data?.createZiel?.ziel?.id
    navigate(`./1/${id}${search}`)
  }, [client, store, tanstackQueryClient, navigate, search, apId])

  const onClickOpenLowerNodes = useCallback(() => {
    openLowerNodes({
      id: apId,
      projId,
      apId,
      client,
      store,
      menuType: 'zielFolder',
    })
  }, [projId, apId, client, store])

  const onClickCloseLowerNodes = useCallback(() => {
    closeLowerNodes({
      url: ['Projekte', projId, 'Arten', apId, 'AP-Ziele'],
      store,
      search,
    })
  }, [projId, apId, store, search])

  return (
    <ErrorBoundary>
      <MenuBar
        bgColor="#388e3c"
        color="white"
      >
        <Tooltip title="Neues Ziel erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Ordner im Navigationsbaum öffnen">
          <IconButton onClick={onClickOpenLowerNodes}>
            <FaFolderTree style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Ordner im Navigationsbaum schliessen">
          <IconButton onClick={onClickCloseLowerNodes}>
            <RiFolderCloseFill style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
