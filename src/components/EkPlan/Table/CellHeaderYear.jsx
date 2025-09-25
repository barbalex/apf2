import { memo, useState, useCallback, useContext, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import styled from '@emotion/styled'
import { gql } from '@apollo/client'

import { useApolloClient, useQuery } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { MobxContext } from '../../../mobxContext.js'
import { yearColumnWidth } from './CellForYear/yearColumnWidth.js'

const StyledCell = styled.div`
  display: flex;
  justify-content: space-evenly;
  color: black;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 60px;
  border-left: solid hsla(120, 25%, 70%, 1) 1px;
  border-right: solid hsla(120, 25%, 70%, 1) 1px;
  border-bottom: solid #e6e6e6 1px;
  background: hsla(120, 25%, 88%, 1);
  cursor: pointer;
  width: ${(props) => props.width}px;
  min-width: ${(props) => props.width}px;
  box-sizing: border-box;
  height: 60px;
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
  color: ${(props) =>
    props.active === 1 ? 'black' : 'rgba(0,0,0,0.3) !important'};
`
const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

export const CellHeaderYear = memo(
  observer(({ column, tpopFilter }) => {
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

    const yearHasKontrollen = useMemo(() => {
      if (filterKontrolleYear && filterKontrolleYear !== column) return false
      return data?.tpopCountWithKontrInYear?.totalCount > 0
    }, [column, filterKontrolleYear, data])
    const yearHasAnsiedlungen = useMemo(() => {
      if (filterAnsiedlungYear && filterAnsiedlungYear !== column) return false
      return data?.tpopCountWithAnsiedlungsInYear?.totalCount > 0
    }, [column, filterAnsiedlungYear, data])
    const yearHasEkplan = useMemo(() => {
      if (filterEkplanYear && filterEkplanYear !== column) return false
      return data?.tpopCountWithEkplanInYear?.totalCount > 0
    }, [column, filterEkplanYear, data])

    const closeMenu = useCallback(() => setAnchorEl(null), [])
    const onClickCell = useCallback((e) => setAnchorEl(e.currentTarget), [])
    const onClickFilterAnsiedlungYear = useCallback(() => {
      if (!yearHasAnsiedlungen) return
      setFilterAnsiedlungYear(filterAnsiedlungYear ? null : column)
      setAnchorEl(null)
      setTimeout(() =>
        tsQueryClient.invalidateQueries({
          queryKey: ['EkplanTpopQuery'],
        }),
      )
    }, [
      apolloClient,
      column,
      filterAnsiedlungYear,
      setFilterAnsiedlungYear,
      yearHasAnsiedlungen,
    ])
    const onClickFilterKontrolleYear = useCallback(() => {
      if (!yearHasKontrollen) return
      setFilterKontrolleYear(filterKontrolleYear ? null : column)
      setAnchorEl(null)
      setTimeout(() =>
        tsQueryClient.invalidateQueries({
          queryKey: ['EkplanTpopQuery'],
        }),
      )
    }, [
      apolloClient,
      column,
      filterKontrolleYear,
      setFilterKontrolleYear,
      yearHasKontrollen,
    ])
    const onClickFilterEkplanYear = useCallback(() => {
      if (!yearHasEkplan) return
      setFilterEkplanYear(filterEkplanYear ? null : column)
      setAnchorEl(null)
      setTimeout(() =>
        tsQueryClient.invalidateQueries({
          queryKey: ['EkplanTpopQuery'],
        }),
      )
    }, [
      apolloClient,
      column,
      filterEkplanYear,
      setFilterEkplanYear,
      yearHasEkplan,
    ])

    const onMouseEnter = useCallback(
      () => hovered.setYear(column),
      [column, hovered],
    )
    const className = hovered.year === column ? 'column-hovered' : ''

    return (
      <>
        <StyledCell
          onMouseEnter={onMouseEnter}
          onMouseLeave={hovered.reset}
          className={className}
          aria-controls="yearHeaderMenu"
          aria-haspopup="true"
          onClick={onClickCell}
          width={yearColumnWidth}
        >
          <Title>{column}</Title>
          <Dropdown>
            {filterSet ?
              <FaFilter />
            : <Caret />}
          </Dropdown>
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
            {filterKontrolleYear === column ?
              `nicht TPop mit Kontrollen in ${column} filtern`
            : `TPop mit Kontrollen in ${column} filtern`}
          </StyledMenuItem>
          <StyledMenuItem
            onClick={onClickFilterEkplanYear}
            active={yearHasEkplan ? 1 : 0}
            dense
          >
            {filterEkplanYear === column ?
              `nicht TPop mit Ekplan in ${column} filtern`
            : `TPop mit Ekplan in ${column} filtern`}
          </StyledMenuItem>
          <StyledMenuItem
            onClick={onClickFilterAnsiedlungYear}
            active={yearHasAnsiedlungen ? 1 : 0}
            dense
          >
            {filterAnsiedlungYear === column ?
              `nicht TPop mit Ansiedlungen in ${column} filtern`
            : `TPop mit Ansiedlungen in ${column} filtern`}
          </StyledMenuItem>
        </Menu>
      </>
    )
  }),
)
