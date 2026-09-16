import { useState } from 'react'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus, FaMinus, FaFolderTree } from 'react-icons/fa6'
import { RiFolderCloseFill } from 'react-icons/ri'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { useSetAtom, useAtomValue } from 'jotai'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { openLowerNodes } from '../../TreeContainer/openLowerNodes/index.ts'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.ts'
import { deleteModule } from '../../TreeContainer/DeleteDatasetModal/delete/index.ts'
import { moveTo } from '../../../../modules/moveTo/index.ts'
import { copyTo } from '../../../../modules/copyTo/index.ts'
import {
  showTreeMenusAtom,
  addNotificationAtom,
  copyingAtom,
  setCopyingAtom,
  movingAtom,
  setMovingAtom,
} from '../../../../store/index.ts'

import type { PopId, ApId } from '../../../../models/apflora/index.ts'

import styles from '../../../shared/Files/Menu/index.module.css'

interface CreatePopResult {
  createPop?: {
    pop?: {
      id: PopId
      apId: ApId
    }
  }
}

interface MenuProps {
  toggleFilterInput?: () => void
  row?: {
    label?: string | null | undefined
  }
}

const iconStyle = { color: 'white' }

export const Menu = ({ row }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId, popId } = useParams()

  const moving = useAtomValue(movingAtom)
  const setMoving = useSetAtom(setMovingAtom)
  const copying = useAtomValue(copyingAtom)
  const setCopying = useSetAtom(setCopyingAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: { data?: CreatePopResult | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreatePopResult>({
        mutation: graphql(`
          mutation createPopForPopRouterForm($apId: UUID!) {
            createPop(input: { pop: { apId: $apId } }) {
              pop {
                id
                apId
              }
            }
          }
        `),
        variables: { apId },
      })
    } catch (error) {
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    void tsQueryClient.invalidateQueries({
      queryKey: [`treePop`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    const id = result?.data?.createPop?.pop?.id
    void navigate(
      `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${id}/Population${search}`,
    )
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const [copyMenuAnchorEl, setCopyMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  )
  const copyMenuOpen = Boolean(copyMenuAnchorEl)

  const onClickDelete = () =>
    void deleteModule({
      search,
      toDelete: {
        table: 'pop',
        id: popId ?? null,
        label: row?.label ?? null,
        url: pathname.split('/').filter((p) => !!p),
        afterDeletionHook: () => {
          void tsQueryClient.invalidateQueries({
            queryKey: [`treeAp`],
          })
        },
      },
    })

  const onClickOpenLowerNodes = () =>
    openLowerNodes({
      id: popId,
      projId,
      apId,
      popId,
      menuType: 'pop',
      parentId: apId,
      jahr: undefined,
    })

  const onClickCloseLowerNodes = () =>
    closeLowerNodes({
      url: ['Projekte', projId, 'Arten', apId, 'Populationen', popId],
      search,
    })

  const isMoving =
    moving.id !== '99999999-9999-9999-9999-999999999999' &&
    moving.table === 'pop'

  const isTpopMoving =
    moving.id !== '99999999-9999-9999-9999-999999999999' &&
    moving.table === 'tpop'
  const thisPopIsMoving = moving.id === popId
  const popMovingFromThisAp = moving.fromParentId === apId

  const onClickMoveInTree = () => {
    if (isTpopMoving) {
      return moveTo({ id: popId })
    }
    setMoving({
      id: popId,
      label: row?.label,
      table: 'pop',
      toTable: 'ap',
      fromParentId: apId,
    })
  }

  const onClickStopMoving = () =>
    setMoving({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      toTable: null,
      fromParentId: null,
    })

  const isCopyingPop = copying.table === 'pop'
  const thisPopIsCopying = copying.id === popId
  const isCopyingTpop = copying.table === 'tpop'

  // TODO: add for feldkontr/freiwkontr/massn in tpop menu
  const onClickCopyTpopToHere = () => copyTo({ parentId: popId })

  const onClickCopyPop = (withNextLevel?: boolean) => {
    if (isCopyingPop) {
      // copy to this ap
      return copyTo({ parentId: apId })
    }
    setCopying({
      table: 'pop',
      id: popId,
      label: row?.label,
      withNextLevel: withNextLevel as boolean,
    })
    setCopyMenuAnchorEl(null)
  }

  const onClickCopyWithoutNextLevel = () => onClickCopyPop(false)
  const onClickCopyWithNextLevel = () => onClickCopyPop(true)

  const onClickStopCopying = () =>
    setCopying({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      withNextLevel: false,
    })

  const showTreeMenus = useAtomValue(showTreeMenusAtom)

  return (
    <ErrorBoundary>
      <MenuBar
        rerenderer={`${isMoving}/${isCopyingPop}/${popMovingFromThisAp}/${showTreeMenus}`}
      >
        <Tooltip title="Neue Population erstellen">
          <IconButton onClick={() => void onClickAdd()}>
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
            <IconButton onClick={() => void onClickCloseLowerNodes()}>
              <RiFolderCloseFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip
          title={
            !isMoving && !isTpopMoving ?
              `'${row?.label}' zu einer anderen Art verschieben`
            : thisPopIsMoving ?
              'Zum Verschieben gemerkt, bereit um in einer anderen Art einzufügen'
            : popMovingFromThisAp ?
              `'${moving.label}' zur selben Art zu vershieben, macht keinen Sinn`
            : isTpopMoving ?
              `Verschiebe '${moving.label}' zu dieser Population`
            : `Verschiebe '${moving.label}' zu dieser Art`
          }
        >
          <IconButton onClick={() => void onClickMoveInTree()}>
            <MdOutlineMoveDown
              style={{
                color:
                  isMoving && thisPopIsMoving ? 'rgb(255, 90, 0)' : 'white',
              }}
            />
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
              void (
                isCopyingTpop ? onClickCopyTpopToHere()
                : isCopyingPop ? onClickCopyPop()
                : setCopyMenuAnchorEl(event.currentTarget)
              )
            }
            aria-owns={copyMenuOpen ? 'copyMenu' : undefined}
          >
            <MdContentCopy
              style={{
                color: thisPopIsCopying ? 'rgb(255, 90, 0)' : 'white',
              }}
            />
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
        <h3 className={styles.menuTitle}>Kopieren:</h3>
        <MenuItem onClick={() => void onClickCopyWithNextLevel()}>
          mit Teilpopulationen
        </MenuItem>
        <MenuItem onClick={() => void onClickCopyWithoutNextLevel()}>
          ohne Teilpopulationen
        </MenuItem>
        <MenuItem onClick={() => setCopyMenuAnchorEl(null)}>abbrechen</MenuItem>
      </MuiMenu>
      <MuiMenu
        id="popDelMenu"
        anchorEl={delMenuAnchorEl}
        open={delMenuOpen}
        onClose={() => setDelMenuAnchorEl(null)}
      >
        <h3 className={styles.menuTitle}>löschen?</h3>
        <MenuItem onClick={() => void onClickDelete()}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
    </ErrorBoundary>
  )
}
