import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaFolderTree } from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { MobxContext } from '../../../../mobxContext.js'
import { showTreeMenusAtom } from '../../../../JotaiStore/index.js'

const iconStyle = { color: 'white' }

export const Menu = observer(({ toggleFilterInput }) => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { projId, apId } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation createZielForZieljahrs($apId: UUID!) {
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
    tsQueryClient.invalidateQueries({
      queryKey: [`treeZiel`],
    })
    apolloClient.invalidateQueries({
      queryKey: [`treeZieljahrs`],
    })
    apolloClient.invalidateQueries({
      queryKey: [`treeZielsOfJahr`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    const id = result?.data?.createZiel?.ziel?.id
    navigate(`./1/${id}${search}`)
  }

  const onClickOpenLowerNodes = () =>
    openLowerNodes({
      id: apId,
      projId,
      apId,
      apolloClient,
      store,
      menuType: 'zielFolder',
    })

  const onClickCloseLowerNodes = () =>
    closeLowerNodes({
      url: ['Projekte', projId, 'Arten', apId, 'AP-Ziele'],
      store,
      search,
    })

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
})
