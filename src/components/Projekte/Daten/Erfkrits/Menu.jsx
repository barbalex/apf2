import { memo, useCallback, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import { MdContentCopy } from 'react-icons/md'
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
    const { setOpenChooseApToCopyErfkritsFrom } = store

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
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
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeErfkrits`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      const id = result?.data?.createErfkrit?.erfkrit?.id
      navigate(`./${id}${search}`)
    }, [client, store, tanstackQueryClient, navigate, search, apId])

    const onClickCopy = useCallback(
      () => setOpenChooseApToCopyErfkritsFrom(true),
      [setOpenChooseApToCopyErfkritsFrom],
    )

    const [labelFilterIsIcon] = useAtom(listLabelFilterIsIconAtom)

    return (
      <ErrorBoundary>
        <MenuBar>
          <LabelFilter
            width={labelFilterIsIcon ? buttonWidth : labelFilterWidth}
          />
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
  }),
)
