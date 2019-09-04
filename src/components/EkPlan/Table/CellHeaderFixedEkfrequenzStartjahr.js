import React, { useState, useCallback, useContext } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { FaSortDown as Caret } from 'react-icons/fa'
import styled from 'styled-components'

import storeContext from '../../../storeContext'

export const StyledCell = styled.div`
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
  padding: 2px 4px;
  margin-top: auto;
  margin-bottom: auto;
`
const Dropdown = styled.div`
  font-size: 1.3em;
`
const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

const CellHeaderFixedEkfrequenzStartjahr = ({ style, column }) => {
  const store = useContext(storeContext)
  const {
    filterEmptyEkfrequenzStartjahr,
    setFilterEmptyEkfrequenzStartjahr,
  } = store.ekPlan

  const [anchorEl, setAnchorEl] = useState(null)

  const closeMenu = useCallback(() => setAnchorEl(null), [])
  const onClickCell = useCallback(e => setAnchorEl(e.currentTarget), [])
  const onClickFilterEmptyValues = useCallback(() => {
    setFilterEmptyEkfrequenzStartjahr(!filterEmptyEkfrequenzStartjahr)
    setAnchorEl(null)
  }, [filterEmptyEkfrequenzStartjahr, setFilterEmptyEkfrequenzStartjahr])

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
          <Caret />
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
          {filterEmptyEkfrequenzStartjahr
            ? 'nicht Leerwerte filtern'
            : 'Leerwerte filtern'}
        </MenuItem>
      </Menu>
    </>
  )
}

export default CellHeaderFixedEkfrequenzStartjahr
