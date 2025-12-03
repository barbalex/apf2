import { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { MobxContext } from '../../../mobxContext.js'

import { cell, title, dropdown } from './CellHeaderYear.module.css'

const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

export const CellHeaderYear = observer(({ column, tpopFilter }) => {
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const store = useContext(MobxContext)
  const {
    hovered,
    filterAnsiedlungYear,
    setFilterAnsiedlungYear,
    filterKontrolleYear,
    setFilterKontrolleYear,
    filterEkplanYear,
    setFilterEkplanYear,
  } = store.ekPlan

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

  const { data, loading, error } = useQuery(
    gql`
      query TpopQueryForCellHeaderYear(
        $kontrFilter: TpopFilter!
        $ansiedlungFilter: TpopFilter!
        $ekplanFilter: TpopFilter!
      ) {
        tpopCountWithKontrInYear: allTpops(filter: $kontrFilter) {
          totalCount
        }
        tpopCountWithAnsiedlungsInYear: allTpops(filter: $ansiedlungFilter) {
          totalCount
        }
        tpopCountWithEkplanInYear: allTpops(filter: $ekplanFilter) {
          totalCount
        }
      }
    `,
    { variables: { kontrFilter, ansiedlungFilter, ekplanFilter } },
  )

  const [anchorEl, setAnchorEl] = useState(null)

  const filterSet =
    filterAnsiedlungYear === column ||
    filterKontrolleYear === column ||
    filterEkplanYear === column

  const yearHasKontrollen =
    filterKontrolleYear && filterKontrolleYear !== column ?
      false
    : data?.tpopCountWithKontrInYear?.totalCount > 0

  const yearHasAnsiedlungen =
    filterAnsiedlungYear && filterAnsiedlungYear !== column ?
      false
    : data?.tpopCountWithAnsiedlungsInYear?.totalCount > 0

  const yearHasEkplan =
    filterEkplanYear && filterEkplanYear !== column ?
      false
    : data?.tpopCountWithEkplanInYear?.totalCount > 0

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

  const onMouseEnter = () => hovered.setYear(column)

  const isHovered = hovered.year === column
  const style = {
    ...(isHovered ? { backgroundColor: 'rgba(182, 194, 182, 1)' } : {}),
  }

  return (
    <>
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        aria-controls="yearHeaderMenu"
        aria-haspopup="true"
        onClick={onClickCell}
        className={cell}
        style={style}
      >
        <div className={title}>{column}</div>
        <div className={dropdown}>
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
})
