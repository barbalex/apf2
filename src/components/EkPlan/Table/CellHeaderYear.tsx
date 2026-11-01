import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import { useQueryClient } from '@tanstack/react-query'

import { useEkPlanYearCounts } from './useEkPlanYearCounts.ts'
import {
  ekPlanHoveredAtom,
  ekPlanSetHoveredYearAtom,
  ekPlanResetHoveredAtom,
  ekPlanFilterAnsiedlungYearAtom,
  ekPlanSetFilterAnsiedlungYearAtom,
  ekPlanFilterKontrolleYearAtom,
  ekPlanSetFilterKontrolleYearAtom,
  ekPlanFilterEkplanYearAtom,
  ekPlanSetFilterEkplanYearAtom,
} from '../../../store/index.ts'

import styles from './CellHeaderYear.module.css'

const anchorOrigin = {
  horizontal: 'left',
  vertical: 'bottom',
} as const

export const CellHeaderYear = ({
  column,
  tpopFilter,
  firstYear,
}: {
  column: number
  tpopFilter: Record<string, unknown>
  firstYear: number
}) => {
  const tsQueryClient = useQueryClient()

  const hovered = useAtomValue(ekPlanHoveredAtom)
  const setHoveredYear = useSetAtom(ekPlanSetHoveredYearAtom)
  const resetHovered = useSetAtom(ekPlanResetHoveredAtom)
  const filterAnsiedlungYear = useAtomValue(ekPlanFilterAnsiedlungYearAtom)
  const setFilterAnsiedlungYear = useSetAtom(ekPlanSetFilterAnsiedlungYearAtom)
  const filterKontrolleYear = useAtomValue(ekPlanFilterKontrolleYearAtom)
  const setFilterKontrolleYear = useSetAtom(ekPlanSetFilterKontrolleYearAtom)
  const filterEkplanYear = useAtomValue(ekPlanFilterEkplanYearAtom)
  const setFilterEkplanYear = useSetAtom(ekPlanSetFilterEkplanYearAtom)

  const { data } = useEkPlanYearCounts(tpopFilter, firstYear)

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const filterSet =
    filterAnsiedlungYear === column ||
    filterKontrolleYear === column ||
    filterEkplanYear === column

  const yearHasKontrollen =
    filterKontrolleYear && filterKontrolleYear !== column ?
      false
    : (data.kontrTpopsByYear.get(column)?.size ?? 0) > 0

  const yearHasAnsiedlungen =
    filterAnsiedlungYear && filterAnsiedlungYear !== column ?
      false
    : (data.ansiedlungTpopsByYear.get(column)?.size ?? 0) > 0

  const yearHasEkplan =
    filterEkplanYear && filterEkplanYear !== column ?
      false
    : (data.ekplanTpopsByYear.get(column)?.size ?? 0) > 0

  const closeMenu = () => setAnchorEl(null)
  const onClickCell = (e: React.MouseEvent) =>
    setAnchorEl(e.currentTarget as HTMLElement)

  const onClickFilterAnsiedlungYear = () => {
    if (!yearHasAnsiedlungen) return
    setFilterAnsiedlungYear(filterAnsiedlungYear ? null : column)
    setAnchorEl(null)
    setTimeout(() => {
      void tsQueryClient.invalidateQueries({
        queryKey: ['EkplanTpopQuery'],
      })
    })
  }

  const onClickFilterKontrolleYear = () => {
    if (!yearHasKontrollen) return
    setFilterKontrolleYear(filterKontrolleYear ? null : column)
    setAnchorEl(null)
    setTimeout(() => {
      void tsQueryClient.invalidateQueries({
        queryKey: ['EkplanTpopQuery'],
      })
    })
  }

  const onClickFilterEkplanYear = () => {
    if (!yearHasEkplan) return
    setFilterEkplanYear(filterEkplanYear ? null : column)
    setAnchorEl(null)
    setTimeout(() => {
      void tsQueryClient.invalidateQueries({
        queryKey: ['EkplanTpopQuery'],
      })
    })
  }

  const onMouseEnter = () => setHoveredYear(column)

  const isHovered = hovered.year === column
  const style = {
    ...(isHovered ? { backgroundColor: 'rgba(182, 194, 182, 1)' } : {}),
  }

  return (
    <>
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={resetHovered}
        aria-controls="yearHeaderMenu"
        aria-haspopup="true"
        onClick={onClickCell}
        className={styles.cell}
        style={style}
      >
        <div className={styles.title}>{column}</div>
        <div className={styles.dropdown}>
          {filterSet ?
            <FaFilter />
          : <Caret />}
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={anchorOrigin}
      >
        <MenuItem
          onClick={onClickFilterKontrolleYear}
          dense
          disabled={!yearHasKontrollen}
        >
          {filterKontrolleYear === column ?
            `Nicht TPop mit Kontrollen in ${column} filtern`
          : `TPop mit Kontrollen in ${column} filtern`}
        </MenuItem>
        <MenuItem
          onClick={onClickFilterEkplanYear}
          disabled={!yearHasEkplan}
          dense
        >
          {filterEkplanYear === column ?
            `Nicht TPop mit Ekplan in ${column} filtern`
          : `TPop mit Ekplan in ${column} filtern`}
        </MenuItem>
        <MenuItem
          onClick={onClickFilterAnsiedlungYear}
          disabled={!yearHasAnsiedlungen}
          dense
        >
          {filterAnsiedlungYear === column ?
            `Nicht TPop mit Ansiedlungen in ${column} filtern`
          : `TPop mit Ansiedlungen in ${column} filtern`}
        </MenuItem>
      </Menu>
    </>
  )
}
