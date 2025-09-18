import { memo, useCallback, useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
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

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { MobxContext } from '../../../../mobxContext.js'
import { showTreeMenusAtom } from '../../../../JotaiStore/index.js'

const MoveIcon = styled(MdOutlineMoveDown)`
  color: white;
`
const CopyIcon = styled(MdContentCopy)`
  color: white;
`
const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(({ toggleFilterInput }) => {
    const { search } = useLocation()
    const navigate = useNavigate()
    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()
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
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpop`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treePopFolders`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treePop`],
      })
      const id = result?.data?.createTpop?.tpop?.id
      navigate(`./${id}${search}`)
    }, [apolloClient, store, tsQueryClient, navigate, search, popId])

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
        tanstackQueryClient: tsQueryClient,
      })
    }, [popId, apolloClient, store, tsQueryClient])

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
        tanstackQueryClient: tsQueryClient,
      })
    }, [popId, apolloClient, store, tsQueryClient])

    const onClickStopCopyingTpop = useCallback(() => {
      setCopying({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        withNextLevel: false,
      })
    }, [setCopying])

    const [showTreeMenus] = useAtom(showTreeMenusAtom)

    return (
      <ErrorBoundary>
        <MenuBar
          rerenderer={`${isTpopMoving}/${isCopyingTpop}/${showTreeMenus}`}
        >
          {!!toggleFilterInput && (
            <FilterButton toggleFilterInput={toggleFilterInput} />
          )}
          <Tooltip title="Neue Teil-Population erstellen">
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
