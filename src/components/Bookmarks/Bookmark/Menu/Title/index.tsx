import { useEffect, type RefObject } from 'react'

import type { NavData } from '../../../types.ts'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Collapse from '@mui/material/Collapse'
import { MdFilterAlt } from 'react-icons/md'
import isUuid from 'is-uuid'
import { useResizeDetector } from 'react-resize-detector'
import { FilterInput } from './FilterInput.tsx'
import { ApFilter } from '../../../../Projekte/TreeContainer/ApFilter/index.tsx'

import styles from './index.module.css'

export const Title = ({
  navData,
  width: parentWidth,
  filterInputIsVisible,
  toggleFilterInput,
  setTitleWidth,
  ref: filterInputRef,
}: {
  navData: NavData
  width?: number | null | undefined
  filterInputIsVisible: boolean
  toggleFilterInput: () => void
  setTitleWidth: React.Dispatch<React.SetStateAction<number>>
  ref?: RefObject<HTMLInputElement | null> | undefined
}) => {
  const isUuidList = navData.menus.some((menu) => isUuid.anyNonNil(String(menu.id)))

  // if is Aps, need to add ApFilter
  const isAps = navData.id === 'Arten'

  const { width: titleWidth, ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 300,
    refreshOptions: { leading: false, trailing: true },
  })
  useEffect(() => {
    setTitleWidth(
      (titleWidth ?? 40) +
        (isUuidList ?
          isAps ? 40 + 58
          : 40
        : 0) +
        32 +
        8,
    )
  }, [titleWidth, setTitleWidth, isUuidList, isAps])

  // minWidth is the larger of parentWidth and width
  const minWidth = Math.max(parentWidth ?? 0, (titleWidth ?? 40) + 40, 80)

  return (
    <div
      className={styles.container}
      style={{ minWidth }}
    >
      <div
        className={styles.contentWrapper}
        style={{ minWidth }}
      >
        <div className={styles.menuTitle}>
          <div
            className={styles.title}
            ref={ref}
          >
            {navData.label}
          </div>
          {!!parentWidth && (
            <div className={styles.filters}>
              <Tooltip
                title="Filtern"
                style={isUuidList ? {} : { display: 'none' }}
              >
                <IconButton
                  aria-label="Filtern"
                  onClick={toggleFilterInput}
                >
                  <MdFilterAlt />
                </IconButton>
              </Tooltip>
              {isAps && (
                <div className={styles.apFilterFitter}>
                  <ApFilter />
                </div>
              )}
            </div>
          )}
        </div>
        <Collapse in={filterInputIsVisible}>
          <FilterInput
            width={parentWidth}
            filterInputIsVisible={filterInputIsVisible}
            toggleFilterInput={toggleFilterInput}
            ref={filterInputRef ?? undefined}
          />
        </Collapse>
      </div>
    </div>
  )
}
