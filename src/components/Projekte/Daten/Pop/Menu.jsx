import { memo, useCallback, useContext, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus, FaFolder, FaFolderTree } from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { isEqual } from 'es-toolkit'
import styled from '@emotion/styled'
import { useAtom } from 'jotai'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { showTreeMenusAtom } from '../../../../JotaiStore/index.js'

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
    const { projId, apId, popId } = useParams()

    const store = useContext(MobxContext)
    const { setMoving, moving, setCopying, copying } = store

    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await apolloClient.mutate({
          mutation: gql`
            mutation createPopForPopRouterForm($apId: UUID!) {
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
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${id}/Population${search}`,
      )
    }, [apId, apolloClient, store, tsQueryClient, navigate, search, projId])

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const [copyMenuAnchorEl, setCopyMenuAnchorEl] = useState(null)
    const copyMenuOpen = Boolean(copyMenuAnchorEl)

    const onClickDelete = useCallback(async () => {
      let result
      try {
        result = await apolloClient.mutate({
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
      tsQueryClient.invalidateQueries({
        queryKey: [`treePop`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`treeAp`],
      })
      // navigate to parent
      navigate(`/Daten/Projekte/${projId}/Arten/${apId}/Populationen${search}`)
    }, [
      apolloClient,
      store,
      tsQueryClient,
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
        apolloClient,
        store,
        menuType: 'pop',
        parentId: apId,
      })
    }, [projId, apId, popId, apolloClient, store])

    const onClickCloseLowerNodes = useCallback(() => {
      closeLowerNodes({
        url: ['Projekte', projId, 'Arten', apId, 'Populationen', popId],
        store,
        search,
      })
    }, [projId, apId, popId, store, search])

    const isMoving =
      moving.id !== '99999999-9999-9999-9999-999999999999' &&
      moving.table === 'pop'
    const isTpopMoving =
      moving.id !== '99999999-9999-9999-9999-999999999999' &&
      moving.table === 'tpop'
    const thisPopIsMoving = moving.id === popId
    const popMovingFromThisAp = moving.fromParentId === apId
    const onClickMoveInTree = useCallback(() => {
      if (isTpopMoving) {
        return moveTo({
          id: popId,
          apolloClient,
          store,
        })
      }
      setMoving({
        id: popId,
        label: row.label,
        table: 'pop',
        toTable: 'ap',
        fromParentId: apId,
      })
    }, [row, setMoving, apId, popId])

    const onClickStopMoving = useCallback(() => {
      setMoving({
        table: null,
        id: '99999999-9999-9999-9999-999999999999',
        label: null,
        toTable: null,
        fromParentId: null,
      })
    }, [setMoving])

    const isCopyingPop = copying.table === 'pop'
    const thisPopIsCopying = copying.id === popId
    const isCopyingTpop = copying.table === 'tpop'

    // TODO: add for feldkontr/frwkontr/massn in tpop menu
    const onClickCopyTpopToHere = useCallback(() => {
      copyTo({
        parentId: popId,
        apolloClient,
        store,
      })
    }, [popId, apolloClient, store])

    const onClickCopyPop = useCallback(
      (withNextLevel) => {
        if (isCopyingPop) {
          // copy to this ap
          return copyTo({
            parentId: apId,
            apolloClient,
            store,
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
      [isCopyingPop, copyTo, apId, apolloClient, store, popId, row, setCopying],
    )
    const onClickCopyWithoutNextLevel = useCallback(
      () => onClickCopyPop(false),
      [onClickCopyPop],
    )
    const onClickCopyWithNextLevel = useCallback(
      () => onClickCopyPop(true),
      [onClickCopyPop],
    )

    const onClickStopCopying = useCallback(() => {
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
          rerenderer={`${isMoving}/${isCopyingPop}/${popMovingFromThisAp}/${showTreeMenus}`}
        >
          <Tooltip title="Neue Population erstellen">
            <IconButton onClick={onClickAdd}>
              <FaPlus style={iconStyle} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Löschen">
            <IconButton
              onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
              aria-owns={delMenuOpen ? 'popDelMenu' : undefined}
            >
              <FaMinus style={iconStyle} />
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
          <Tooltip
            title={
              !isMoving && !isTpopMoving ?
                `'${row.label}' zu einer anderen Art verschieben`
              : thisPopIsMoving ?
                'Zum Verschieben gemerkt, bereit um in einer anderen Art einzufügen'
              : popMovingFromThisAp ?
                `'${moving.label}' zur selben Art zu vershieben, macht keinen Sinn`
              : isTpopMoving ?
                `Verschiebe '${moving.label}' zu dieser Population`
              : `Verschiebe '${moving.label}' zu dieser Art`
            }
          >
            <IconButton onClick={onClickMoveInTree}>
              <MoveIcon moving={(isMoving && thisPopIsMoving).toString()} />
            </IconButton>
          </Tooltip>
          {isMoving && (
            <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
              <IconButton onClick={onClickStopMoving}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip
            title={
              isCopyingPop ? `Kopiere '${copying.label}' in diese Art`
              : isCopyingTpop ?
                `Kopiere '${copying.label}' in diese Population`
              : 'Kopieren'
            }
          >
            <IconButton
              onClick={(event) =>
                isCopyingTpop ? onClickCopyTpopToHere()
                : isCopyingPop ? onClickCopyPop()
                : setCopyMenuAnchorEl(event.currentTarget)
              }
              aria-owns={copyMenuOpen ? 'copyMenu' : undefined}
            >
              <CopyIcon copying={thisPopIsCopying.toString()} />
            </IconButton>
          </Tooltip>
          {(isCopyingPop || isCopyingTpop) && (
            <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
              <IconButton onClick={onClickStopCopying}>
                <BsSignStopFill style={iconStyle} />
              </IconButton>
            </Tooltip>
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
