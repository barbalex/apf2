import { memo, useCallback, useContext, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus, FaFolder, FaFolderTree } from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import isEqual from 'lodash/isEqual'
import styled from '@emotion/styled'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'

const MoveIcon = styled(MdOutlineMoveDown)`
  color: ${(props) =>
    props.moving === 'true' ? 'rgb(255, 90, 0) !important' : 'inherit'};
`
const CopyIcon = styled(MdContentCopy)`
  color: ${(props) =>
    props.copying === 'true' ? 'rgb(255, 90, 0) !important' : 'inherit'};
`

export const Menu = memo(
  observer(({ row }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const tanstackQueryClient = useQueryClient()
    const { projId, apId, popId } = useParams()
    const store = useContext(StoreContext)
    const { setMoving, moving, setCopying, copying } = store

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createPopForPopForm($apId: UUID!) {
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
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treePop`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      const id = result?.data?.createPop?.pop?.id
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${id}${search}`,
      )
    }, [apId, client, store, tanstackQueryClient, navigate, search, projId])

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const onClickDelete = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation deletePop($id: UUID!) {
              deletePopById(input: { id: $id }) {
                pop {
                  id
                }
              }
            }
          `,
          variables: { id: row.id },
        })
      } catch (error) {
        return store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }

      // remove active path from openNodes
      const openNodesRaw = store?.tree?.openNodes
      const openNodes = getSnapshot(openNodesRaw)
      const activePath = pathname.split('/').filter((p) => !!p)
      const newOpenNodes = openNodes.filter((n) => !isEqual(n, activePath))
      store.tree.setOpenNodes(newOpenNodes)

      // update tree query
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treePop`],
      })
      tanstackQueryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      // navigate to parent
      navigate(`/Daten/Projekte/${projId}/Arten/${apId}/Populationen${search}`)
    }, [
      client,
      store,
      tanstackQueryClient,
      navigate,
      search,
      apId,
      projId,
      row,
      pathname,
    ])

    const onClickOpenLowerNodes = useCallback(() => {
      openLowerNodes({
        id: popId,
        projId,
        apId,
        popId,
        client,
        store,
        menuType: 'pop',
        parentId: apId,
      })
    }, [projId, apId, popId, client, store])

    const onClickCloseLowerNodes = useCallback(() => {
      closeLowerNodes({
        url: ['Projekte', projId, 'Arten', apId, 'Populationen', popId],
        store,
        search,
      })
    }, [projId, apId, popId, store, search])

    const isMoving = moving.id !== '99999999-9999-9999-9999-999999999999'
    const onClickMoveInTree = useCallback(() => {
      setMoving({
        id: row.id,
        label: row.label,
        table: 'pop',
        toTable: 'ap',
        fromParentId: apId,
      })
    }, [row, setMoving])

    const onClickStopMoving = useCallback(() => {
      setMoving({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        toTable: null,
        fromParentId: null,
      })
    }, [setMoving])

    const onClickMoveHere = useCallback(() => {
      moveTo({
        id: apId,
        client,
        store,
        tanstackQueryClient,
      })
    }, [client, store, popId])

    const isCopying =
      copying.id !== '99999999-9999-9999-9999-999999999999' && !!copying.id
    const thisPopIsCopying = isCopying && copying.id === popId
    const onClickCopy = useCallback(() => {
      if (isCopying) {
        // copy to this ap
        return copyTo({
          parentId: apId,
          client,
          store,
          tanstackQueryClient,
        })
      }
      setCopying({
        table: 'pop',
        id: popId,
        label: row.label,
        withNextLevel: false,
      })
    }, [
      isCopying,
      copyTo,
      apId,
      client,
      store,
      tanstackQueryClient,
      popId,
      row,
      setCopying,
    ])

    const onClickStopCopying = useCallback(() => {
      setCopying({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        withNextLevel: false,
      })
    }, [setMoving])

    return (
      <ErrorBoundary>
        <MenuBar rerenderer={`${isMoving}/${isCopying}`}>
          <IconButton
            title="Neue Population erstellen"
            onClick={onClickAdd}
          >
            <FaPlus />
          </IconButton>
          <IconButton
            title="Löschen"
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'popDelMenu' : undefined}
          >
            <FaMinus />
          </IconButton>
          <IconButton
            title="Ordner im Navigationsbaum öffnen"
            onClick={onClickOpenLowerNodes}
          >
            <FaFolderTree />
          </IconButton>
          <IconButton
            title="Ordner im Navigationsbaum schliessen"
            onClick={onClickCloseLowerNodes}
          >
            <RiFolderCloseFill />
          </IconButton>
          {!(
            isMoving &&
            moving.id !== popId &&
            moving.fromParentId !== apId
          ) && (
            <IconButton
              title={
                isMoving ?
                  'Zum Verschieben gemerkt, bereit um in einer anderen Art einzufügen'
                : 'Verschiebe im Navigationsbaum'
              }
              onClick={onClickMoveInTree}
            >
              <MoveIcon
                moving={(isMoving && moving.id === row.id).toString()}
              />
            </IconButton>
          )}
          {isMoving && (
            <IconButton
              title={`Verschieben von '${row.label}' abbrechen`}
              onClick={onClickStopMoving}
            >
              <BsSignStopFill />
            </IconButton>
          )}
          {!(isCopying && copying.id !== popId) && (
            <IconButton
              title={
                isCopying ?
                  `Kopiere '${copying.label}' in diese Art`
                : 'Kopieren'
              }
              onClick={onClickCopy}
            >
              <CopyIcon copying={thisPopIsCopying.toString()} />
            </IconButton>
          )}
          {isCopying && (
            <IconButton
              title={`Kopieren von '${row.label}' abbrechen`}
              onClick={onClickStopCopying}
            >
              <BsSignStopFill />
            </IconButton>
          )}
        </MenuBar>
        <MuiMenu
          id="popDelMenu"
          anchorEl={delMenuAnchorEl}
          open={delMenuOpen}
          onClose={() => setDelMenuAnchorEl(null)}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: 120,
            },
          }}
        >
          <MenuTitle>löschen?</MenuTitle>
          <MenuItem onClick={onClickDelete}>ja</MenuItem>
          <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
        </MuiMenu>
      </ErrorBoundary>
    )
  }),
)
