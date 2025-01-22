import { memo, useCallback, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaFolderTree } from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { MobxContext } from '../../../../mobxContext.js'
import { showTreeMenusAtom } from '../../../../JotaiStore/index.js'

const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ toggleFilterInput }) => {
    const { search } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, jahr } = useParams()
    const store = useContext(MobxContext)

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createZielForZielsForm($apId: UUID!) {
              createZiel(input: { ziel: { apId: $apId } }) {
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
      queryClient.invalidateQueries({
        queryKey: [`treeZieljahrs`],
      })
      queryClient.invalidateQueries({
        queryKey: [`treeZielsOfJahr`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeAp`],
      })
      const id = result?.data?.createZiel?.ziel?.id
      navigate(`./${id}${search}`)
    }, [client, store, tanstackQueryClient, navigate, search, apId])

    const onClickOpenLowerNodes = useCallback(() => {
      console.log('Menu onClickOpenLowerNodes', { projId, apId, jahr })
      openLowerNodes({
        id: apId,
        projId,
        apId,
        parentId: apId,
        client,
        store,
        jahr,
        menuType: 'zieljahrFolder',
      })
    }, [projId, apId, client, store, jahr])

    const onClickCloseLowerNodes = useCallback(() => {
      closeLowerNodes({
        url: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', +jahr],
        store,
        search,
      })
    }, [projId, apId, store, search, jahr])

    const [showTreeMenus] = useAtom(showTreeMenusAtom)

    return (
      <ErrorBoundary>
        <MenuBar rerenderer={showTreeMenus}>
          {!!toggleFilterInput && (
            <FilterButton toggleFilterInput={toggleFilterInput} />
          )}
          <Tooltip title="Neues Ziel erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          {showTreeMenus && (
            <Tooltip title="Ordner im Navigationsbaum öffnen">
              <IconButton onClick={onClickOpenLowerNodes}>
                <FaFolderTree style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {showTreeMenus && (
            <Tooltip title="Ordner im Navigationsbaum schliessen">
              <IconButton onClick={onClickCloseLowerNodes}>
                <RiFolderCloseFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
