import { memo, useCallback, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaFolderTree } from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { MobxContext } from '../../../../storeContext.js'
import { LabelFilter, labelFilterWidth } from '../../../shared/LabelFilter.jsx'
import { listLabelFilterIsIconAtom } from '../../../../JotaiStore/index.js'
import { hideTreeAtom } from '../../../../JotaiStore/index.js'

const MoveIcon = styled(MdOutlineMoveDown)`
  color: white;
`
const CopyIcon = styled(MdContentCopy)`
  color: white;
`
const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(() => {
    const { search } = useLocation()
    const navigate = useNavigate()
    const apolloClient = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, popId } = useParams()
    const store = useContext(MobxContext)
    const { setMoving, moving, setCopying, copying } = store

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await apolloClient.mutate({
          mutation: gql`
            mutation createTpopForTpopsForm($popId: UUID!) {
              createTpop(input: { tpop: { popId: $popId } }) {
                tpop {
                  id
                  popId
                }
              }
            }
          `,
          variables: {
            popId,
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
        queryKey: [`treeTpops`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treePopFolders`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treePop`],
      })
      const id = result?.data?.createTpop?.tpop?.id
      navigate(`./${id}${search}`)
    }, [apolloClient, store, tanstackQueryClient, navigate, search, popId])

    const onClickOpenLowerNodes = useCallback(() => {
      openLowerNodes({
        id: popId,
        projId,
        apId,
        popId,
        client: apolloClient,
        store,
        menuType: 'tpopFolder',
      })
    }, [projId, apId, popId, apolloClient, store])

    const onClickCloseLowerNodes = useCallback(() => {
      closeLowerNodes({
        url: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
        ],
        store,
        search,
      })
    }, [projId, apId, popId, store, search])

    const isTpopMoving = moving.table === 'tpop'
    const onClickMoveTpopToHere = useCallback(() => {
      moveTo({
        id: popId,
        client: apolloClient,
        store,
        tanstackQueryClient,
      })
    }, [popId, apolloClient, store, tanstackQueryClient])

    const onClickStopMovingTpop = useCallback(() => {
      setMoving({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        toTable: null,
        fromParentId: null,
      })
    }, [setMoving])

    const isCopyingTpop = copying.table === 'tpop'

    const onClickCopyTpopToHere = useCallback(() => {
      copyTo({
        parentId: popId,
        client: apolloClient,
        store,
        tanstackQueryClient,
      })
    }, [popId, apolloClient, store, tanstackQueryClient])

    const onClickStopCopyingTpop = useCallback(() => {
      setCopying({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        withNextLevel: false,
      })
    }, [setCopying])

    const [labelFilterIsIcon] = useAtom(listLabelFilterIsIconAtom)
    const [hideTree] = useAtom(hideTreeAtom)

    return (
      <ErrorBoundary>
        <MenuBar
          rerenderer={`${isTpopMoving}/${isCopyingTpop}/${hideTree}`}
        >
          <LabelFilter
            width={labelFilterIsIcon ? buttonWidth : labelFilterWidth}
          />
          <Tooltip title="Neue Teil-Population erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          {!hideTree && (
            <Tooltip title="Ordner im Navigationsbaum öffnen">
              <IconButton onClick={onClickOpenLowerNodes}>
                <FaFolderTree style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {!hideTree && (
            <Tooltip title="Ordner im Navigationsbaum schliessen">
              <IconButton onClick={onClickCloseLowerNodes}>
                <RiFolderCloseFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {isTpopMoving && (
            <Tooltip
              title={`Verschiebe '${moving.label}' zu dieser Population`}
            >
              <IconButton onClick={onClickMoveTpopToHere}>
                <MoveIcon />
              </IconButton>
            </Tooltip>
          )}
          {isCopyingTpop && (
            <Tooltip title={`Kopiere '${copying.label}' in diese Population`}>
              <IconButton onClick={onClickCopyTpopToHere}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
          )}
          {isCopyingTpop && (
            <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
              <IconButton onClick={onClickStopCopyingTpop}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
