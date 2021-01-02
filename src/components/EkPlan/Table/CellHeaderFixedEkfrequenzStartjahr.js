import React, { useState, useCallback, useContext } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import styled from 'styled-components'

import storeContext from '../../../storeContext'
import TextFilter from './CellHeaderFixed/TextFilter'

export const StyledCell = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  font-size: 0.75rem;
  color: black;
  line-height: 60px;
  border-left: solid hsla(120, 25%, 70%, 1) 1px;
  border-right: solid hsla(120, 25%, 70%, 1) 1px;
  border-bottom: solid #e6e6e6 1px;
  background: hsla(120, 25%, 88%, 1);
  padding: 0 4px;
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
  padding: 2px 0;
  margin-top: auto;
  margin-bottom: auto;
  user-select: none;
`
const Dropdown = styled.div`
  font-size: 1.3em;
  padding-left: 2px;
`
const StyledFaFilter = styled(FaFilter)`
  font-size: 0.9em;
  padding-right: 3px;
`
const TextFilterContainer = styled.div`
  padding: 0 16px;
`
const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

const CellHeaderFixedEkfrequenzStartjahr = ({ style, column }) => {
  const store = useContext(storeContext)
  const {
    filterEkfrequenzStartjahrEmpty,
    setFilterEmptyEkfrequenzStartjahr,
    filterEkfrequenzStartjahr,
    setFilterEkfrequenzStartjahr,
  } = store.ekPlan

  const [anchorEl, setAnchorEl] = useState(null)

  const closeMenu = useCallback(() => setAnchorEl(null), [])
  const onClickCell = useCallback((e) => setAnchorEl(e.currentTarget), [])
  const onClickFilterEmptyValues = useCallback(() => {
    if (!filterEkfrequenzStartjahrEmpty && filterEkfrequenzStartjahr) {
      setFilterEkfrequenzStartjahr(null)
    }
    setFilterEmptyEkfrequenzStartjahr(!filterEkfrequenzStartjahrEmpty)
    setAnchorEl(null)
  }, [
    filterEkfrequenzStartjahrEmpty,
    setFilterEkfrequenzStartjahr,
    setFilterEmptyEkfrequenzStartjahr,
    filterEkfrequenzStartjahr,
  ])

  const { label } = column

  return (
    <>
      <StyledCell
        style={style}
        aria-controls="ekfrequenzStartjahrHeaderMenu"
        aria-haspopup="true"
        onClick={onClickCell}
      >
        <Title>{label}</Title>
        <Dropdown>
          {filterEkfrequenzStartjahrEmpty || filterEkfrequenzStartjahr ? (
            <StyledFaFilter />
          ) : (
            <Caret />
          )}
        </Dropdown>
      </StyledCell>
      <Menu
        id="ekfrequenzStartjahrHeaderMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={anchorOrigin}
        getContentAnchorEl={null}
      >
        <MenuItem onClick={onClickFilterEmptyValues} dense>
          {filterEkfrequenzStartjahrEmpty
            ? 'nicht Leerwerte filtern'
            : 'Leerwerte filtern'}
        </MenuItem>
        <TextFilterContainer>
          <TextFilter column={column} closeMenu={closeMenu} />
        </TextFilterContainer>
      </Menu>
    </>
  )
}

export default CellHeaderFixedEkfrequenzStartjahr
