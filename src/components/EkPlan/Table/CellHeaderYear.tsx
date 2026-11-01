import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { apiFetch } from '../../../modules/api.ts'

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
}: {
  column: number
  tpopFilter: Record<string, unknown>
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

  const { data } = useSuspenseQuery({
    queryKey: [
      'tpopCountsForYear',
      column,
      kontrFilter,
      ansiedlungFilter,
      ekplanFilter,
    ],
    queryFn: async () => {
      // phase 5: three rpcCount calls; the reverse `some` semantics
      // (tpop matches filter AND has a child in the year) become child
      // queries with the tpop filter nested into tpopByTpopId
      const tpopOf = (filter: object) => ({
        ...filter,
        tpopByTpopId: {
          ...((filter as { tpopByTpopId?: object }).tpopByTpopId ?? {}),
          ...tpopFilter,
        },
      })
      const distinctTpops = async (url: string, p_filter: object) => {
        const rows =
          (await apiFetch<{ tpop_id: string }[]>(url, {
            method: 'POST',
            body: JSON.stringify({ p_filter }),
          })) ?? []
        return new Set(rows.map((r) => r.tpop_id)).size
      }
      const [kontrCount, ansiedlungCount, ekplanCount] = await Promise.all([
        distinctTpops(
          '/rpc/query_tpopkontr?select=tpop_id',
          tpopOf({ jahr: { equalTo: column } }),
        ),
        distinctTpops(
          '/rpc/query_tpopmassn?select=tpop_id',
          tpopOf({
            jahr: { equalTo: column },
            tpopmassnTypWerteByTyp: { ansiedlung: { equalTo: true } },
          }),
        ),
        (async () => {
          // ekplan has no query_ RPC — resolve tpop ids of the filter first
          const tpops =
            (await apiFetch<{ id: string }[]>('/rpc/query_tpop?select=id', {
              method: 'POST',
              body: JSON.stringify({ p_filter: tpopFilter }),
            })) ?? []
          if (!tpops.length) return 0
          const ids = tpops.map((t) => t.id)
          const plans =
            (await apiFetch<{ tpop_id: string }[]>(
              `/ekplan?jahr=eq.${column}&tpop_id=in.(${ids.join(',')})&select=tpop_id`,
            )) ?? []
          return new Set(plans.map((p) => p.tpop_id)).size
        })(),
      ])
      return {
        tpopCountWithKontrInYear: { totalCount: kontrCount },
        tpopCountWithAnsiedlungsInYear: { totalCount: ansiedlungCount },
        tpopCountWithEkplanInYear: { totalCount: ekplanCount },
      } as TpopQueryForCellHeaderYearResult
    },
  })

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const filterSet =
    filterAnsiedlungYear === column ||
    filterKontrolleYear === column ||
    filterEkplanYear === column

  const yearHasKontrollen =
    filterKontrolleYear && filterKontrolleYear !== column ?
      false
    : data.tpopCountWithKontrInYear.totalCount > 0

  const yearHasAnsiedlungen =
    filterAnsiedlungYear && filterAnsiedlungYear !== column ?
      false
    : data.tpopCountWithAnsiedlungsInYear.totalCount > 0

  const yearHasEkplan =
    filterEkplanYear && filterEkplanYear !== column ?
      false
    : data.tpopCountWithEkplanInYear.totalCount > 0

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
