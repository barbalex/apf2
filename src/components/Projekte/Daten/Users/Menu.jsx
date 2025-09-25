import { memo, useCallback, useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { RiFolderCloseFill } from 'react-icons/ri'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'

const Fitter = styled.div`
  margin-top: -15px;
  padding-left: 5px;
`
const iconStyle = { color: 'white' }

export const Menu = memo(({ toggleFilterInput }) => {
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, userId } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = useCallback(async () => {
    let result
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation createUserForUsersForm {
            createUser(input: { user: {} }) {
              user {
                id
              }
            }
          }
        `,
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
      queryKey: [`treeUser`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    const id = result?.data?.createUser?.user?.id
    navigate(`./${id}${search}`)
  }, [apolloClient, store, tsQueryClient, navigate, search])

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neuen Benutzer erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
