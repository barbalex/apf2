import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { lazy, Suspense } from 'react'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import {
  userTokenAtom,
  copyingAtom,
  copyingBiotopAtom,
  movingAtom,
  mapActiveApfloraLayersAtom,
  newTpopFromBeobDialogOpenAtom,
  newTpopFromBeobBeobIdAtom,
} from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import { treeContextMenuAtom } from './treeContextMenuAtom.ts'
import { treeMenuConfigs, type MenuContext, type TreeMenuConfig } from './menuConfig.tsx'
import { useRunMenuAction } from './useRunMenuAction.ts'
import type { TreeNodeData } from '../Tree/types.ts'
import type { TreeContextMenuState } from './treeContextMenuAtom.ts'

import styles from './TreeContextMenu.module.css'

const TpopFromBeobPopList = lazy(async () => ({
  default: (await import('../TpopFromBeobPopList.tsx')).TpopFromBeobPopList,
}))

interface OpenContextMenuProps {
  menuState: TreeContextMenuState
  node: TreeNodeData
  config: TreeMenuConfig
  menuContext: MenuContext
  runMenuAction: ReturnType<typeof useRunMenuAction>
  closeMenu: () => void
}

// mounted fresh for every menu opened (key={menuState}), so selection
// state resets automatically
const OpenContextMenu = ({
  menuState,
  node,
  config,
  menuContext,
  runMenuAction,
  closeMenu,
}: OpenContextMenuProps) => {
  const menuRef = useRef<HTMLElement | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const visibleItems =
    config.items.filter((item) => !item.when || item.when(menuContext)) ?? []

  // place the menu at the pointer before paint, flipping at the
  // viewport edges; hidden until placed to avoid flicker
  useLayoutEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    const { x, y } = menuState
    const { innerWidth, innerHeight } = window
    const rect = menu.getBoundingClientRect()
    let top = y
    let left = x
    if (y + rect.height > innerHeight) {
      top -= rect.height
    }
    if (x + rect.width > innerWidth) {
      left -= rect.width
    }
    if (top < 0) {
      top = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0
    }
    if (left < 0) {
      left = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0
    }
    menu.style.top = `${top}px`
    menu.style.left = `${left}px`
    menu.style.visibility = 'visible'
  }, [menuState, visibleItems.length])

  const activateItem = (index: number) => {
    const item = visibleItems[index]
    closeMenu()
    if (item) {
      runMenuAction(item, node)
    }
  }

  // hide on outside pointer down, any scroll, resize, context menu
  // elsewhere; keyboard navigation
  useEffect(() => {
    const menu = menuRef.current
    const onPointerDown = (e: PointerEvent) => {
      if (!menu?.contains(e.target as Node)) closeMenu()
    }
    // rows stopPropagation on their contextmenu events, so this only
    // fires for context menus opened elsewhere on the page
    const onContextMenu = (e: MouseEvent) => {
      if (!menu?.contains(e.target as Node)) closeMenu()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMenu()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) =>
          visibleItems.length === 0 ? -1 : (i + 1) % visibleItems.length,
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) =>
          visibleItems.length === 0 ?
            -1
          : (i <= 0 ? visibleItems.length : i) - 1,
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        // like the former implementation: Enter without selection closes
        if (selectedIndex === -1) {
          closeMenu()
        } else {
          activateItem(selectedIndex)
        }
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    // capture: also catch scrolls of elements like the tree container
    document.addEventListener('scroll', closeMenu, { capture: true })
    window.addEventListener('resize', closeMenu)
    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('scroll', closeMenu, { capture: true })
      window.removeEventListener('resize', closeMenu)
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleItems, selectedIndex, closeMenu, runMenuAction, node])

  return createPortal(
    <nav
      role="menu"
      tabIndex={-1}
      ref={menuRef}
      className={styles.menu}
      style={{ position: 'fixed', visibility: 'hidden' }}
      onContextMenu={(e) => {
        e.preventDefault()
        closeMenu()
      }}
      onMouseLeave={() => closeMenu()}
    >
      <div
        className={styles.title}
        style={config.titleWidth ? { width: config.titleWidth } : undefined}
      >
        {config.title}
      </div>
      {visibleItems.map((item, index) => (
        <div
          key={index}
          role="menuitem"
          tabIndex={-1}
          className={
            index === selectedIndex ?
              `${styles.item} ${styles.itemSelected}`
            : styles.item
          }
          onClick={() => activateItem(index)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          {typeof item.label === 'function' ?
            item.label(menuContext)
          : item.label}
        </div>
      ))}
    </nav>,
    document.body,
  )
}

/**
 * single context menu for the nav tree, replacing the vendored
 * react-contextmenu library. Opened via treeContextMenuAtom.
 * Renders the menu for the node's menuType from treeMenuConfigs.
 */
export const TreeContextMenu = () => {
  const menuState = useAtomValue(treeContextMenuAtom)
  const closeMenu = useSetAtom(treeContextMenuAtom)

  const runMenuAction = useRunMenuAction()

  const moving = useAtomValue(movingAtom)
  const copying = useAtomValue(copyingAtom)
  const copyingBiotop = useAtomValue(copyingBiotopAtom)
  const userToken = useAtomValue(userTokenAtom)
  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)

  const menuContext: MenuContext = {
    mayWrite: !userIsReadOnly(userToken),
    mayWriteFreiw: !userIsReadOnly(userToken, true),
    moving,
    copying,
    copyingBiotop,
    beobZugeordnetLayerIsActive: activeApfloraLayers.includes('beobZugeordnet'),
  }

  const [newTpopFromBeobDialogOpen, setNewTpopFromBeobDialogOpen] = useAtom(
    newTpopFromBeobDialogOpenAtom,
  )
  const newTpopFromBeobBeobId = useAtomValue(newTpopFromBeobBeobIdAtom)
  const closeNewTpopFromBeobDialog = () => setNewTpopFromBeobDialogOpen(false)

  const node = menuState?.node
  const config = node ? treeMenuConfigs[node.menuType] : undefined

  return (
    <ErrorBoundary>
      {config && node && menuState ?
        <OpenContextMenu
          key={menuState.id}
          menuState={menuState}
          node={node}
          config={config}
          menuContext={menuContext}
          runMenuAction={runMenuAction}
          closeMenu={() => closeMenu(null)}
        />
      : null}
      <Suspense fallback={null}>
        <Dialog
          open={newTpopFromBeobDialogOpen}
          onClose={closeNewTpopFromBeobDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="xl"
          className={styles.dialog}
        >
          <DialogTitle id="alert-dialog-title">
            {'Population wählen:'}
          </DialogTitle>
          <DialogContent dividers={false}>
            <TpopFromBeobPopList
              beobId={newTpopFromBeobBeobId}
              closeNewTpopFromBeobDialog={closeNewTpopFromBeobDialog}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeNewTpopFromBeobDialog}
              color="inherit"
            >
              abbrechen
            </Button>
          </DialogActions>
        </Dialog>
      </Suspense>
    </ErrorBoundary>
  )
}
