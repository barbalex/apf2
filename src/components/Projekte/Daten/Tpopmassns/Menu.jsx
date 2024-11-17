import { memo, useCallback, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { FaPlus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'

const MoveIcon = styled(MdOutlineMoveDown)`
  color: white;
`
const CopyIcon = styled(MdContentCopy)`
  color: white;
`
const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ row }) => {
    const { search } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, popId, tpopId } = useParams()
    const store = useContext(StoreContext)
    const { setMoving, moving, setCopying, copying } = store

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createTpopmassnForTpopmassnForm($tpopId: UUID!) {
              createTpopmassn(input: { tpopmassn: { tpopId: $tpopId } }) {
                tpopmassn {
                  id
                  tpopId
                }
              }
            }
          `,
          variables: {
            tpopId,
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
        queryKey: [`treeTpopmassn`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeTpopFolders`],
      })
      const id = result?.data?.createTpopmassn?.tpopmassn?.id
      navigate(`./${id}${search}`)
    }, [client, store, tanstackQueryClient, navigate, search, tpopId])

    const isMovingMassn = moving.table === 'tpopmassn'
    const onClickMoveMassnToHere = useCallback(() => {
      return moveTo({
        id: tpopId,
        client,
        store,
        tanstackQueryClient,
      })
    }, [tpopId, client, store, tanstackQueryClient, moveTo])

    const onClickStopMoving = useCallback(() => {
      setMoving({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        toTable: null,
        fromParentId: null,
      })
    }, [setMoving])

    const isCopyingMassn = copying.table === 'tpopmassn'
    const onClickCopyMassnToHere = useCallback(() => {
      return copyTo({
        parentId: tpopId,
        client,
        store,
        tanstackQueryClient,
      })
    }, [copyTo, tpopId, client, store, tanstackQueryClient])

    const onClickStopCopying = useCallback(() => {
      setCopying({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        withNextLevel: false,
      })
    }, [setCopying])

    return (
      <ErrorBoundary>
        <MenuBar
          bgColor="#388e3c"
          color="white"
          rerenderer={`${moving.label}/${copying.label}/${isMovingMassn}/${isCopyingMassn}`}
        >
          <Tooltip title="Neue Massnahme erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          {isMovingMassn && (
            <Tooltip title={`Verschiebe '${moving.label}' hierhin`}>
              <IconButton onClick={onClickMoveMassnToHere}>
                <MoveIcon />
              </IconButton>
            </Tooltip>
          )}
          {isMovingMassn && (
            <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
              <IconButton onClick={onClickStopMoving}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {isCopyingMassn && (
            <Tooltip title={`Kopiere '${copying.label}' hierhin`}>
              <IconButton onClick={onClickCopyMassnToHere}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
          )}
          {isCopyingMassn && (
            <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
              <IconButton onClick={onClickStopCopying}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
