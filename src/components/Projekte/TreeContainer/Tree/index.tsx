// TanStack Virtual is incompatible with React Compiler memoization
'use no memo'

import { useVirtualizer } from '@tanstack/react-virtual'
import type { Virtualizer } from '@tanstack/react-virtual'
import { useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'

import { Row } from './Row.tsx'
import { Menu } from './Menu.tsx'
import { ChildLoader } from './ChildLoader.tsx'
import { RootProviders } from './RootProviders.tsx'
import { FocusPathLoader } from './FocusPathLoader.tsx'
import { checkIfIsOpen } from './checkIfIsOpen.ts'
import { useVisibleTreeRows } from './useVisibleTreeRows.ts'
import type { TreeRowData } from './useVisibleTreeRows.ts'
import {
  treeLastTouchedNodeAtom,
  treeActiveNodeArrayAtom,
  treeOpenNodesAtom,
} from '../../../../store/index.ts'

import styles from './index.module.css'

/**
 * Scrolls the last touched node (or the active node) into view,
 * replacing the former DOM-querying IntoViewScroller.
 *
 * The row is looked up by key in the flattened rows and scrolled to via
 * virtualizer.scrollToIndex. The attempt is driven by rows changes:
 * while the tree is still loading, the row is not in rows yet and every
 * registry update re-runs the attempt - no polling needed. Each focus
 * target is only scrolled to once (scrolledForKey). Ancestors of the
 * focus target are loaded by FocusPathLoader, even when their rows are
 * outside the virtualized window.
 */
const useScrollTouchedNodeIntoView = (
  rows: TreeRowData[],
  virtualizer: Virtualizer<HTMLDivElement, Element>,
) => {
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const lastTouchedNode = useAtomValue(treeLastTouchedNodeAtom)
  const previousActiveNodeArrayRef = useRef<(string | number)[]>([])
  const scrolledForKeyRef = useRef<string | null>(null)
  // whether scrolling is suppressed for the current focus target.
  // identity-only re-sets of activeNodeArray must not change it
  const focusSkipRef = useRef(false)
  // last ancestor row scrolled to for a not (yet) existing exact row
  const ancestorScrolledForKeyRef = useRef<string | null>(null)

  // when opening a folder without activating it, lastTouchedNode differs
  // from activeNodeArray. Only scroll to the node the user interacted with
  const urlToFocus = lastTouchedNode.length ? lastTouchedNode : activeNodeArray
  const focusKey = urlToFocus.length ? JSON.stringify(urlToFocus) : null

  // track whether the active node transition was a node being closed
  // (current is a proper prefix of the previous array) - like the former
  // IntoViewScroller, closing a node must not scroll.
  // Strictly shorter: identity-only re-sets of an equal array are not closes
  useEffect(() => {
    const prev = previousActiveNodeArrayRef.current
    const nodeWasClosed =
      prev.length > activeNodeArray.length &&
      activeNodeArray.every((element, index) => element === prev[index])
    previousActiveNodeArrayRef.current = activeNodeArray
    if (nodeWasClosed) {
      focusSkipRef.current = true
    } else {
      // a real navigation re-enables scrolling for the current target
      focusSkipRef.current = false
    }
  }, [activeNodeArray])

  useEffect(() => {
    if (!focusKey) return
    if (scrolledForKeyRef.current === focusKey) return
    // the focus target arose from closing a node: don't scroll
    if (focusSkipRef.current) return
    const index = rows.findIndex((row) => row.key === focusKey)
    if (index === -1) {
      // no exact row (yet). Either the tree is still loading - then rows
      // change and this effect runs again - or the url has no own row,
      // f.i. form urls with a trailing singular segment ('.../Feld-Kontrolle').
      // Scroll to the deepest existing ancestor row instead, once per
      // ancestor: progressively descends while data loads
      let targetUrl: (string | number)[]
      try {
        targetUrl = JSON.parse(focusKey) as (string | number)[]
      } catch {
        return
      }
      let ancestor: TreeRowData | undefined
      for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i]
        if (!row) continue
        const rowUrl = row.node.url
        if (rowUrl.length >= targetUrl.length) continue
        if (
          JSON.stringify(rowUrl) !==
          JSON.stringify(targetUrl.slice(0, rowUrl.length))
        )
          continue
        ancestor = row
        break
      }
      if (!ancestor) return
      if (ancestorScrolledForKeyRef.current === ancestor.key) return
      ancestorScrolledForKeyRef.current = ancestor.key
      const ancestorIndex = rows.indexOf(ancestor)
      const virtualItems = virtualizer.getVirtualItems()
      const firstIndex = virtualItems[0]?.index
      const lastIndex = virtualItems.at(-1)?.index
      if (
        firstIndex !== undefined &&
        lastIndex !== undefined &&
        ancestorIndex >= firstIndex &&
        ancestorIndex <= lastIndex
      )
        return
      virtualizer.scrollToIndex(ancestorIndex, { align: 'center' })
      return
    }
    scrolledForKeyRef.current = focusKey
    // if the row is within the rendered window, it is visible: don't scroll
    const virtualItems = virtualizer.getVirtualItems()
    const firstIndex = virtualItems[0]?.index
    const lastIndex = virtualItems.at(-1)?.index
    if (
      firstIndex !== undefined &&
      lastIndex !== undefined &&
      index >= firstIndex &&
      index <= lastIndex
    )
      return
    virtualizer.scrollToIndex(index, { align: 'center' })
    // virtualizer is unstable per render; reading it fresh each run
    // makes that harmless
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey, rows])
}

export const TreeComponent = () => {
  const scrollElementRef = useRef<HTMLDivElement>(null)
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const lastTouchedNode = useAtomValue(treeLastTouchedNodeAtom)
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const urlToFocus = lastTouchedNode.length ? lastTouchedNode : activeNodeArray
  const focusKey = urlToFocus.length ? JSON.stringify(urlToFocus) : null

  const rows = useVisibleTreeRows()
  const virtualizer = useVirtualizer({
    count: rows.length,
    // matches the measured height of single-line rows; multi-line
    // rows (labels with \n) are corrected via measureElement
    estimateSize: () => 24,
    getItemKey: (index) => rows[index]?.key ?? index,
    getScrollElement: () => scrollElementRef.current,
    overscan: 15,
  })

  useScrollTouchedNodeIntoView(rows, virtualizer)

  return (
    <div
      className={styles.container}
      ref={scrollElementRef}
    >
      <RootProviders />
      {/* loads ancestors of the focus target even when their rows are
          outside the virtualized window (scroll-into-view deadlock) */}
      <FocusPathLoader
        rows={rows}
        focusKey={focusKey}
      />
      <Menu />
      <div
        className={styles.rows}
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index]
          if (!row) return null

          const needsChildrenLoad =
            !!row.menu.fetcherName &&
            !row.menu.childrenAreFolders &&
            checkIfIsOpen({ menu: row.menu, openNodes })

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className={styles.row}
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <Row node={row.node} />
              {needsChildrenLoad && <ChildLoader menu={row.menu} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
