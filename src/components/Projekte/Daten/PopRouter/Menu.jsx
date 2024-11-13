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
    props.moving === 'true' ? 'rgb(255, 90, 0) !important' : 'white'};
`
const CopyIcon = styled(MdContentCopy)`
  color: ${(props) =>
    props.copying === 'true' ? 'rgb(255, 90, 0) !important' : 'white'};
`
const iconStyle = { color: 'white' }

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

    const [copyMenuAnchorEl, setCopyMenuAnchorEl] = useState(null)
    const copyMenuOpen = Boolean(copyMenuAnchorEl)

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
          variables: { id: popId },
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
      popId,
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
    const thisPopIsMoving = moving.id === popId
    const popMovingFromThisAp = moving.fromParentId === apId
    const onClickMoveInTree = useCallback(() => {
      setMoving({
        id: row.id,
        label: row.label,
        table: 'pop',
        toTable: 'ap',
        fromParentId: apId,
      })
    }, [row, setMoving, apId])

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
    const thisPopIsCopying = copying.id === popId

    const onClickCopy = useCallback(
      (withNextLevel) => {
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
          withNextLevel,
        })
        setCopyMenuAnchorEl(null)
      },
      [
        isCopying,
        copyTo,
        apId,
        client,
        store,
        tanstackQueryClient,
        popId,
        row,
        setCopying,
      ],
    )
    const onClickCopyWithoutNextLevel = useCallback(
      () => onClickCopy(false),
      [onClickCopy],
    )
    const onClickCopyWithNextLevel = useCallback(
      () => onClickCopy(true),
      [onClickCopy],
    )

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
          rerenderer={`${isMoving}/${isCopying}`}
        >
          <IconButton
            title="Neue Population erstellen"
            onClick={onClickAdd}
          >
            <FaPlus style={iconStyle} />
          </IconButton>
          <IconButton
            title="Löschen"
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'popDelMenu' : undefined}
          >
            <FaMinus style={iconStyle} />
          </IconButton>
          <IconButton
            title="Ordner im Navigationsbaum öffnen"
            onClick={onClickOpenLowerNodes}
          >
            <FaFolderTree style={iconStyle} />
          </IconButton>
          <IconButton
            title="Ordner im Navigationsbaum schliessen"
            onClick={onClickCloseLowerNodes}
          >
            <RiFolderCloseFill style={iconStyle} />
          </IconButton>
          <IconButton
            title={
              !isMoving ? `'${row.label}' zu einer anderen Art verschieben`
              : thisPopIsMoving ?
                'Zum Verschieben gemerkt, bereit um in einer anderen Art einzufügen'
              : popMovingFromThisAp ?
                `'${moving.label}' zur selben Art zu vershieben, macht keinen Sinn`
              : `Verschiebe '${moving.label}' zu dieser Art`
            }
            onClick={onClickMoveInTree}
          >
            <MoveIcon moving={(isMoving && thisPopIsMoving).toString()} />
          </IconButton>
          {isMoving && (
            <IconButton
              title={`Verschieben von '${moving.label}' abbrechen`}
              onClick={onClickStopMoving}
            >
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          )}
          <IconButton
            title={
              isCopying ? `Kopiere '${copying.label}' in diese Art` : 'Kopieren'
            }
            onClick={(event) =>
              isCopying ? onClickCopy() : (
                setCopyMenuAnchorEl(event.currentTarget)
              )
            }
            aria-owns={copyMenuOpen ? 'copyMenu' : undefined}
          >
            <CopyIcon copying={thisPopIsCopying.toString()} />
          </IconButton>
          {isCopying && (
            <IconButton
              title={`Kopieren von '${copying.label}' abbrechen`}
              onClick={onClickStopCopying}
            >
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          )}
        </MenuBar>
        <MuiMenu
          id="copyMenu"
          anchorEl={copyMenuAnchorEl}
          open={copyMenuOpen}
          onClose={() => setCopyMenuAnchorEl(null)}
        >
          <MenuTitle>Kopieren:</MenuTitle>
          <MenuItem onClick={onClickCopyWithNextLevel}>
            mit Teilpopulationen
          </MenuItem>
          <MenuItem onClick={onClickCopyWithoutNextLevel}>
            ohne Teilpopulationen
          </MenuItem>
          <MenuItem onClick={() => setCopyMenuAnchorEl(null)}>
            abbrechen
          </MenuItem>
        </MuiMenu>
        <MuiMenu
          id="popDelMenu"
          anchorEl={delMenuAnchorEl}
          open={delMenuOpen}
          onClose={() => setDelMenuAnchorEl(null)}
        >
          <MenuTitle>löschen?</MenuTitle>
          <MenuItem onClick={onClickDelete}>ja</MenuItem>
          <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
        </MuiMenu>
      </ErrorBoundary>
    )
  }),
)
