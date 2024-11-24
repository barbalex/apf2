import { memo, useCallback, useContext, useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
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

// TODO: add menu to setOpenChooseApToCopyEkfrequenzsFrom
export const Menu = memo(
  observer(() => {
    const { search } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { apId } = useParams()

    const store = useContext(StoreContext)
    const { setOpenChooseApToCopyEkfrequenzsFrom } = store

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
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

    const onClickCopy = useCallback(
      () => setOpenChooseApToCopyEkfrequenzsFrom(true),
      [setOpenChooseApToCopyEkfrequenzsFrom],
    )

    const [labelFilterIsIcon] = useAtom(listLabelFilterIsIconAtom)
    const widths = useMemo(
      () =>
        labelFilterIsIcon ?
          [buttonWidth, buttonWidth, buttonWidth]
        : [labelFilterWidth, buttonWidth, buttonWidth],
      [labelFilterIsIcon],
    )

    return (
      <ErrorBoundary>
        <MenuBar widths={widths}>
          <LabelFilter />
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
  }),
)
