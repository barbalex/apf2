import { memo, useCallback, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { FaPlus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { LabelFilter, labelFilterWidth } from '../../../shared/LabelFilter.jsx'
import { listLabelFilterIsIconAtom } from '../../../../JotaiStore/index.js'

const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(() => {
    const { search } = useLocation()
    const navigate = useNavigate()
    const apolloClient = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { tpopkontrId } = useParams()
    const store = useContext(MobxContext)

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await apolloClient.mutate({
          mutation: gql`
            mutation createTpopkontrzaehlForTpopkontrzaehlsForm(
              $tpopkontrId: UUID!
            ) {
              createTpopkontrzaehl(
                input: { tpopkontrzaehl: { tpopkontrId: $tpopkontrId } }
              ) {
                tpopkontrzaehl {
                  id
                  tpopkontrId
                }
              }
            }
          `,
          variables: {
            tpopkontrId,
          },
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
        queryKey: [`treeTpopfeldkontrzaehls`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopfeldkontrzaehlFolders`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopfeldkontr`],
      })
      const id = result?.data?.createTpopkontrzaehl?.tpopkontrzaehl?.id
      navigate(`./${id}${search}`)
    }, [
      apolloClient,
      store,
      tanstackQueryClient,
      navigate,
      search,
      tpopkontrId,
    ])

    const [labelFilterIsIcon] = useAtom(listLabelFilterIsIconAtom)

    return (
      <ErrorBoundary>
        <MenuBar>
          <LabelFilter
            width={labelFilterIsIcon ? buttonWidth : labelFilterWidth}
          />
          <Tooltip title="Neue Zählung erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
