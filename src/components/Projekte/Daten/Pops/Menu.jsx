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

import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'
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
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tsQueryClient = useQueryClient()
    const { projId, apId } = useParams()
    const store = useContext(MobxContext)
    const { setMoving, moving, setCopying, copying } = store

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createPopForPopsForm($apId: UUID!) {
              createPop(input: { pop: { apId: $apId } }) {
                pop {
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
        queryKey: [`treePop`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeAp`],
      })
      const id = result?.data?.createPop?.pop?.id
      navigate(`./${id}${search}`)
    }, [apId, client, store, tsQueryClient, navigate, search])

    const onClickOpenLowerNodes = useCallback(() => {
      openLowerNodes({
        id: apId,
        projId,
        apId,
        client,
        store,
        menuType: 'popFolder',
      })
    }, [projId, apId, client, store])

    const onClickCloseLowerNodes = useCallback(() => {
      closeLowerNodes({
        url: ['Projekte', projId, 'Arten', apId, 'Populationen'],
        store,
        search,
      })
    }, [projId, apId, store, search])

    const isMovingPop = moving.table === 'pop'
    const popMovingFromThisAp = moving.fromParentId === apId
    const onClickMovePopToHere = useCallback(() => {
      moveTo({
        id: apId,
        client,
        store,
      })
    }, [client, store, apId])

    const onClickStopMovingPop = useCallback(() => {
      setMoving({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        toTable: null,
        fromParentId: null,
      })
    }, [setMoving])

    const isCopyingPop = copying.table === 'pop'

    const onClickCopyPopToHere = useCallback(() => {
      return copyTo({
        parentId: apId,
        client,
        store,
      })
    }, [apId, client, store])

    const onClickStopCopyingPop = useCallback(() => {
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
          rerenderer={`${isMovingPop}/${isCopyingPop}/${popMovingFromThisAp}/${showTreeMenus}`}
        >
          {!!toggleFilterInput && (
            <FilterButton toggleFilterInput={toggleFilterInput} />
          )}
          <Tooltip title="Neue Population erstellen">
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
          {isMovingPop && (
            <Tooltip
              title={
                popMovingFromThisAp ?
                  `'${moving.label}' zur selben Art zu vershieben, macht keinen Sinn`
                : `Verschiebe '${moving.label}' zu dieser Art`
              }
            >
              <IconButton onClick={onClickMovePopToHere}>
                <MoveIcon />
              </IconButton>
            </Tooltip>
          )}
          {isMovingPop && (
            <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
              <IconButton onClick={onClickStopMovingPop}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          {isCopyingPop && (
            <Tooltip title={`Kopiere '${copying.label}' in diese Art`}>
              <IconButton onClick={onClickCopyPopToHere}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
          )}
          {isCopyingPop && (
            <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
              <IconButton onClick={onClickStopCopyingPop}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
