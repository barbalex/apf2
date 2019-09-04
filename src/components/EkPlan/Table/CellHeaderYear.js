import React, { useState, useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { FaSortDown as Caret } from 'react-icons/fa'
import styled from 'styled-components'

import storeContext from '../../../storeContext'

const StyledCell = styled.div`
  display: flex;
  font-weight: 500;
  font-size: 0.75rem;
  color: black;
  line-height: 60px;
  border-left: solid hsla(120, 25%, 70%, 1) 1px;
  border-right: solid hsla(120, 25%, 70%, 1) 1px;
  border-bottom: solid #e6e6e6 1px;
  background: hsla(120, 25%, 88%, 1);
  cursor: pointer;
  &.column-hovered {
    background: hsla(120, 25%, 82%, 1) !important;
    font-weight: 800 !important;
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

/**
 * TODO:
 * enable filtering for "mit Ansiedlung"
 */

const CellHeaderYear = ({ style, column }) => {
  const store = useContext(storeContext)
  const {
    hovered,
    filterAnsiedlungYear,
    setFilterAnsiedlungYear,
    filterKontrolleYear,
    setFilterKontrolleYear,
  } = store.ekPlan

  const [anchorEl, setAnchorEl] = useState(null)

  const closeMenu = useCallback(() => setAnchorEl(null), [])
  const onClickCell = useCallback(e => setAnchorEl(e.currentTarget), [])
  const onClickFilterAnsiedlungYear = useCallback(() => {
    setFilterAnsiedlungYear(filterAnsiedlungYear ? null : column)
    setAnchorEl(null)
  }, [column, filterAnsiedlungYear, setFilterAnsiedlungYear])
  const onClickFilterKontrolleYear = useCallback(() => {
    setFilterKontrolleYear(filterKontrolleYear ? null : column)
    setAnchorEl(null)
  }, [column, filterKontrolleYear, setFilterKontrolleYear])

  const onMouseEnter = useCallback(() => hovered.setYear(column), [
    column,
    hovered,
  ])
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
        <Dropdown>
          <Caret />
        </Dropdown>
      </StyledCell>
      <Menu
        id="yearHeaderMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        getContentAnchorEl={null}
      >
        <MenuItem onClick={onClickFilterKontrolleYear}>
          {filterKontrolleYear === column
            ? 'nicht nach Kontrollen filtern'
            : `TPop mit Kontrollen in ${column} filtern`}
        </MenuItem>
        <MenuItem onClick={onClickFilterAnsiedlungYear}>
          {filterAnsiedlungYear === column
            ? 'nicht nach Ansiedlungen filtern'
            : `TPop mit Ansiedlungen in ${column} filtern`}
        </MenuItem>
      </Menu>
    </>
  )
}

export default observer(CellHeaderYear)
