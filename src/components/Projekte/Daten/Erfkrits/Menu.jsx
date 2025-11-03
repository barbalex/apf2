import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import { MdContentCopy } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'

const iconStyle = { color: 'white' }

export const Menu = observer(({ toggleFilterInput }) => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { apId } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const store = useContext(MobxContext)
  const { setOpenChooseApToCopyErfkritsFrom } = store

  const onClickAdd = async () => {
    let result
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation createErfkritForErfkritsForm($apId: UUID!) {
            createErfkrit(input: { erfkrit: { apId: $apId } }) {
              erfkrit {
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
      queryKey: [`treeErfkrit`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    const id = result?.data?.createErfkrit?.erfkrit?.id
    navigate(`./${id}${search}`)
  }

  const onClickCopy = () => setOpenChooseApToCopyErfkritsFrom(true)

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neues Erfolgs-Kriterium erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Aus anderer Art kopieren">
          <IconButton onClick={onClickCopy}>
            <MdContentCopy style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
