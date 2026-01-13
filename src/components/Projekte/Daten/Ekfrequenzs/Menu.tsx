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
import type { EkfrequenzId, ApId } from '../../../../models/apflora/index.js'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'

interface CreateEkfrequenzResult {
  data?: {
    createEkfrequenz?: {
      ekfrequenz?: {
        id: EkfrequenzId
        apId: ApId
      }
    }
  }
}

interface MenuProps {
  toggleFilterInput?: () => void
}

const iconStyle = { color: 'white' }

// TODO: add menu to setOpenChooseApToCopyEkfrequenzsFrom
export const Menu = observer(({ toggleFilterInput }: MenuProps) => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { apId } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const store = useContext(MobxContext)
  const { setOpenChooseApToCopyEkfrequenzsFrom } = store

  const onClickAdd = async () => {
    let result: CreateEkfrequenzResult | undefined
    try {
      result = await apolloClient.mutate<CreateEkfrequenzResult>({
        mutation: gql`
          mutation createEkfrequenzForEkfrequenzsForm($apId: UUID!) {
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
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: [`treeEkfrequenz`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    const id = result?.data?.createEkfrequenz?.ekfrequenz?.id
    navigate(`./${id}${search}`)
  }

  const onClickCopy = () => setOpenChooseApToCopyEkfrequenzsFrom(true)

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue EK-Frequenz erstellen">
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
