import React, { useState, useCallback, useContext, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import styled from '@emotion/styled'

import storeContext from '../../../storeContext'

const StyledCell = styled.div`
  display: flex;
  color: black;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 60px;
  border-left: solid hsla(120, 25%, 70%, 1) 1px;
  border-right: solid hsla(120, 25%, 70%, 1) 1px;
  border-bottom: solid #e6e6e6 1px;
  background: hsla(120, 25%, 88%, 1);
  cursor: pointer;
  &.column-hovered {
    background: hsla(120, 25%, 82%, 1) !important;
    font-weight: 700 !important;
  }
`
const Title = styled.div`
  text-align: left;
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
  padding: 2px 0 2px 5px;
  margin-top: auto;
  margin-bottom: auto;
`
const Dropdown = styled.div`
  font-size: 1.3em;
`
const StyledMenuItem = styled(MenuItem)`
  color: ${(props) => (props.active ? 'black' : 'rgba(0,0,0,0.3) !important')};
`
const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

const CellHeaderYear = ({ style, column, rows }) => {
  const store = useContext(storeContext)
  const {
    hovered,
    filterAnsiedlungYear,
    setFilterAnsiedlungYear,
    filterKontrolleYear,
    setFilterKontrolleYear,
    filterEkplanYear,
    setFilterEkplanYear,
  } = store.ekPlan

  const [anchorEl, setAnchorEl] = useState(null)

  const filterSet =
    filterAnsiedlungYear === column ||
    filterKontrolleYear === column ||
    filterEkplanYear === column

  const yearHasKontrollen = useMemo(() => {
    if (filterKontrolleYear && filterKontrolleYear !== column) return false
    return (
      rows.filter(
        (row) =>
          (row?.tpop?.tpopkontrsByTpopId?.nodes ?? []).filter(
            (node) => node.jahr === column,
          ).length > 0,
      ).length > 0
    )
  }, [column, filterKontrolleYear, rows])
  const yearHasAnsiedlungen = useMemo(() => {
    if (filterAnsiedlungYear && filterAnsiedlungYear !== column) return false
    return (
      rows.filter(
        (row) =>
          (row?.tpop?.tpopmassnsByTpopId?.nodes ?? []).filter(
            (node) => node.jahr === column,
          ).length > 0,
      ).length > 0
    )
  }, [column, filterAnsiedlungYear, rows])
  const yearHasEkplan = useMemo(() => {
    if (filterEkplanYear && filterEkplanYear !== column) return false
    return (
      rows.filter(
        (row) =>
          (row?.tpop?.ekplansByTpopId?.nodes ?? []).filter(
            (node) => node.jahr === column,
          ).length > 0,
      ).length > 0
    )
  }, [column, filterEkplanYear, rows])

  const closeMenu = useCallback(() => setAnchorEl(null), [])
  const onClickCell = useCallback((e) => setAnchorEl(e.currentTarget), [])
  const onClickFilterAnsiedlungYear = useCallback(() => {
    if (!yearHasAnsiedlungen) return
    setFilterAnsiedlungYear(filterAnsiedlungYear ? null : column)
    setAnchorEl(null)
  }, [
    column,
    filterAnsiedlungYear,
    setFilterAnsiedlungYear,
    yearHasAnsiedlungen,
  ])
  const onClickFilterKontrolleYear = useCallback(() => {
    if (!yearHasKontrollen) return
    setFilterKontrolleYear(filterKontrolleYear ? null : column)
    setAnchorEl(null)
  }, [column, filterKontrolleYear, setFilterKontrolleYear, yearHasKontrollen])
  const onClickFilterEkplanYear = useCallback(() => {
    if (!yearHasEkplan) return
    setFilterEkplanYear(filterEkplanYear ? null : column)
    setAnchorEl(null)
  }, [column, filterEkplanYear, setFilterEkplanYear, yearHasEkplan])

  const onMouseEnter = useCallback(
    () => hovered.setYear(column),
    [column, hovered],
  )
  const className = hovered.year === column ? 'column-hovered' : ''

  return (
    <>
      <StyledCell
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        className={className}
        aria-controls="yearHeaderMenu"
        aria-haspopup="true"
        onClick={onClickCell}
      >
        <Title>{column}</Title>
        <Dropdown>{filterSet ? <FaFilter /> : <Caret />}</Dropdown>
      </StyledCell>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={anchorOrigin}
      >
        <StyledMenuItem
          onClick={onClickFilterKontrolleYear}
          active={yearHasKontrollen ? 1 : 0}
          dense
        >
          {filterKontrolleYear === column
            ? `nicht TPop mit Kontrollen in ${column} filtern`
            : `TPop mit Kontrollen in ${column} filtern`}
        </StyledMenuItem>
        <StyledMenuItem
          onClick={onClickFilterEkplanYear}
          active={yearHasEkplan ? 1 : 0}
          dense
        >
          {filterEkplanYear === column
            ? `nicht TPop mit Ekplan in ${column} filtern`
            : `TPop mit Ekplan in ${column} filtern`}
        </StyledMenuItem>
        <StyledMenuItem
          onClick={onClickFilterAnsiedlungYear}
          active={yearHasAnsiedlungen ? 1 : 0}
          dense
        >
          {filterAnsiedlungYear === column
            ? `nicht TPop mit Ansiedlungen in ${column} filtern`
            : `TPop mit Ansiedlungen in ${column} filtern`}
        </StyledMenuItem>
      </Menu>
    </>
  )
}

export default observer(CellHeaderYear)
