import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient, useQuery } from '@tanstack/react-query'

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

const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

export const CellHeaderYear = ({ column, tpopFilter }) => {
  const apolloClient = useApolloClient()
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

  const kontrFilter = {
    ...tpopFilter,
    tpopkontrsByTpopId: { some: { jahr: { equalTo: column } } },
  }
  const ansiedlungFilter = {
    ...tpopFilter,
    tpopmassnsByTpopId: {
      some: {
        tpopmassnTypWerteByTyp: { ansiedlung: { equalTo: true } },
        jahr: { equalTo: column },
      },
    },
  }
  const ekplanFilter = {
    ...tpopFilter,
    ekplansByTpopId: { some: { jahr: { equalTo: column } } },
  }

  interface TpopCountWithKontrInYear {
    totalCount: number
  }

  interface TpopCountWithAnsiedlungsInYear {
    totalCount: number
  }

  interface TpopCountWithEkplanInYear {
    totalCount: number
  }

  interface TpopQueryForCellHeaderYearResult {
    tpopCountWithKontrInYear: TpopCountWithKontrInYear
    tpopCountWithAnsiedlungsInYear: TpopCountWithAnsiedlungsInYear
    tpopCountWithEkplanInYear: TpopCountWithEkplanInYear
  }

  const { data } = useQuery({
    queryKey: [
      'tpopCountsForYear',
      column,
      kontrFilter,
      ansiedlungFilter,
      ekplanFilter,
    ],
    queryFn: async () => {
      const result = await apolloClient.query<TpopQueryForCellHeaderYearResult>(
        {
          query: gql`
            query TpopQueryForCellHeaderYear(
              $kontrFilter: TpopFilter!
              $ansiedlungFilter: TpopFilter!
              $ekplanFilter: TpopFilter!
            ) {
              tpopCountWithKontrInYear: allTpops(filter: $kontrFilter) {
                totalCount
              }
              tpopCountWithAnsiedlungsInYear: allTpops(
                filter: $ansiedlungFilter
              ) {
                totalCount
              }
              tpopCountWithEkplanInYear: allTpops(filter: $ekplanFilter) {
                totalCount
              }
            }
          `,
          variables: { kontrFilter, ansiedlungFilter, ekplanFilter },
        },
      )
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const [anchorEl, setAnchorEl] = useState(null)

  const filterSet =
    filterAnsiedlungYear === column ||
    filterKontrolleYear === column ||
    filterEkplanYear === column

  const yearHasKontrollen =
    filterKontrolleYear && filterKontrolleYear !== column ?
      false
    : data?.data?.tpopCountWithKontrInYear?.totalCount > 0

  const yearHasAnsiedlungen =
    filterAnsiedlungYear && filterAnsiedlungYear !== column ?
      false
    : data?.data?.tpopCountWithAnsiedlungsInYear?.totalCount > 0

  const yearHasEkplan =
    filterEkplanYear && filterEkplanYear !== column ?
      false
    : data?.data?.tpopCountWithEkplanInYear?.totalCount > 0

  const closeMenu = () => setAnchorEl(null)
  const onClickCell = (e) => setAnchorEl(e.currentTarget)

  const onClickFilterAnsiedlungYear = () => {
    if (!yearHasAnsiedlungen) return
    setFilterAnsiedlungYear(filterAnsiedlungYear ? null : column)
    setAnchorEl(null)
    setTimeout(() =>
      tsQueryClient.invalidateQueries({
        queryKey: ['EkplanTpopQuery'],
      }),
    )
  }

  const onClickFilterKontrolleYear = () => {
    if (!yearHasKontrollen) return
    setFilterKontrolleYear(filterKontrolleYear ? null : column)
    setAnchorEl(null)
    setTimeout(() =>
      tsQueryClient.invalidateQueries({
        queryKey: ['EkplanTpopQuery'],
      }),
    )
  }

  const onClickFilterEkplanYear = () => {
    if (!yearHasEkplan) return
    setFilterEkplanYear(filterEkplanYear ? null : column)
    setAnchorEl(null)
    setTimeout(() =>
      tsQueryClient.invalidateQueries({
        queryKey: ['EkplanTpopQuery'],
      }),
    )
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
