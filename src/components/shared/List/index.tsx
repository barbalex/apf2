// TanStack Virtual is incompatible with React Compiler memoization
'use no memo'

import { useNavigate, useLocation } from 'react-router'
import { useVirtualizer } from '@tanstack/react-virtual'
import Highlighter from 'react-highlight-words'

import { FormTitle } from '../FormTitle/index.tsx'
import { ErrorBoundary } from '../ErrorBoundary.tsx'
import { prefetchRouteData } from '../../../modules/prefetchRouteData.ts'

import styles from './index.module.css'

import type { ComponentType } from 'react'
import { useRef } from 'react'

import type { NavData, NavMenuData } from '../../Bookmarks/types.ts'
import type { navListFilterAtoms } from '../../../store/index.ts'

export const List = ({
  navData,
  MenuBarComponent = null,
  menuBarProps = {},
  highlightSearchString,
}: {
  navData: NavData
  MenuBarComponent?: ComponentType<{ toggleFilterInput?: () => void }> | null
  menuBarProps?: Record<string, unknown>
  highlightSearchString?: string | null | undefined
}) => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const listRef = useRef<HTMLDivElement>(null)

  const menus = navData.menus
  const virtualizer = useVirtualizer({
    count: menus.length,
    estimateSize: () => 35,
    getItemKey: (index) => menus[index]?.id ?? index,
    getScrollElement: () => listRef.current,
    overscan: 10,
  })

  const onClickRow = async (item: NavMenuData) => {
    const path = `./${item.id}${search}`
    // Prefetch before navigating (in case user didn't hover)
    await prefetchRouteData(path)
    void navigate(path)
  }

  const onMouseEnterRow = (item: NavMenuData) => {
    const path = `./${item.id}${search}`
    // Prefetch on hover
    void prefetchRouteData(path)
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title={navData.label}
          listFilter={navData.listFilter as keyof typeof navListFilterAtoms | undefined}
          MenuBarComponent={MenuBarComponent}
          menuBarProps={menuBarProps}
        />
        <div className={styles.list} ref={listRef}>
          <div
            className={styles.rows}
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const item = menus[virtualRow.index]
              if (!item) return null
              const label = item.label ?? item.labelEkf ?? item.labelEk

              return (
                <div
                  className={
                    virtualRow.index === menus.length - 1 ?
                      `${styles.row} ${styles.rowLast}`
                    : styles.row
                  }
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                  onClick={() => void onClickRow(item)}
                  onMouseEnter={() => onMouseEnterRow(item)}
                >
                  {!!item.labelLeftElements?.length &&
                    item.labelLeftElements.map((El, index) => <El key={index} />)}
                  {highlightSearchString ?
                    <Highlighter
                      searchWords={[highlightSearchString]}
                      textToHighlight={label?.toString() ?? ''}
                    />
                  : label}
                  {!!item.labelRightElements?.length &&
                    item.labelRightElements.map((El, index) => (
                      <El key={index} />
                    ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
