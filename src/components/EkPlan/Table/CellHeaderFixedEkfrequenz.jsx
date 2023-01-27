import React, { useState, useCallback, useContext } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import styled from '@emotion/styled'

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
  box-sizing: border-box;
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
  font-size: 0.8em;
`
const TextFilterContainer = styled.div`
  padding: 0 16px;
`
const StyledMenu = styled(Menu)`
  & .MuiPaper-root {
    overflow: hidden !important;
  }
`
const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

const CellHeaderFixedEkfrequenz = ({ style, column }) => {
  const store = useContext(storeContext)
  const {
    filterEkfrequenzEmpty,
    setFilterEmptyEkfrequenz,
    filterEkfrequenz,
    setFilterEkfrequenz,
  } = store.ekPlan

  const [anchorEl, setAnchorEl] = useState(null)

  const closeMenu = useCallback(() => {
    console.log('CellHeaderFixedEkfrequenz closing menu')
    setAnchorEl(null)
  }, [])
  const onClickCell = useCallback((e) => setAnchorEl(e.currentTarget), [])
  const onClickFilterEmptyValues = useCallback(() => {
    if (!filterEkfrequenzEmpty && filterEkfrequenz) {
      setFilterEkfrequenz(null)
    }
    setFilterEmptyEkfrequenz(!filterEkfrequenzEmpty)
    setAnchorEl(null)
  }, [
    filterEkfrequenzEmpty,
    setFilterEkfrequenz,
    setFilterEmptyEkfrequenz,
    filterEkfrequenz,
  ])

  const { label } = column

  return (
    <>
      <StyledCell
        style={style}
        aria-controls="ekfrequenzHeaderMenu"
        aria-haspopup="true"
        onClick={onClickCell}
      >
        <Title>{label}</Title>
        <Dropdown>
          {filterEkfrequenzEmpty || filterEkfrequenz ? (
            <StyledFaFilter />
          ) : (
            <Caret />
          )}
        </Dropdown>
      </StyledCell>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={anchorOrigin}
      >
        <MenuItem onClick={onClickFilterEmptyValues} dense>
          {filterEkfrequenzEmpty
            ? 'nicht Leerwerte filtern'
            : 'Leerwerte filtern'}
        </MenuItem>
        <TextFilterContainer>
          <TextFilter column={column} closeMenu={closeMenu} />
        </TextFilterContainer>
      </StyledMenu>
    </>
  )
}

export default CellHeaderFixedEkfrequenz
