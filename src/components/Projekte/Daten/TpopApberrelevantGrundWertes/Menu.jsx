import { memo, useCallback, useContext, useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { RiFolderCloseFill } from 'react-icons/ri'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { StoreContext } from '../../../../storeContext.js'
import { LabelFilter, labelFilterWidth } from '../../../shared/LabelFilter.jsx'
import { listLabelFilterIsIconAtom } from '../../../../JotaiStore/index.js'

const Fitter = styled.div`
  margin-top: -15px;
  padding-left: 5px;
`
const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(() => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, tpopApberrelevantGrundWerteId } = useParams()
    const store = useContext(StoreContext)

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createTpopApberrelevantGrundWerteForTpopApberrelevantGrundWerteForm {
              createTpopApberrelevantGrundWerte(
                input: { tpopApberrelevantGrundWerte: {} }
              ) {
                tpopApberrelevantGrundWerte {
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
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopApberrelevantGrundWerte`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeRoot`],
      })
      const id =
        result?.data?.createTpopApberrelevantGrundWerte
          ?.tpopApberrelevantGrundWerte?.id
      navigate(`./${id}${search}`)
    }, [client, store, tanstackQueryClient, navigate, search])

    const [labelFilterIsIcon] = useAtom(listLabelFilterIsIconAtom)
    const widths = useMemo(
      () =>
        labelFilterIsIcon ?
          [buttonWidth, buttonWidth]
        : [labelFilterWidth, buttonWidth],
      [labelFilterIsIcon],
    )

    return (
      <ErrorBoundary>
        <MenuBar widths={widths}>
          <LabelFilter />
          <Tooltip title="Neuen Grund erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)