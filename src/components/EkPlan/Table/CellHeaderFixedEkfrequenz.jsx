import { useState, useContext } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../mobxContext.js'
import { TextFilter } from './CellHeaderFixed/TextFilter.jsx'

import {
  cell,
  title,
  dropdown,
  faFilter,
  textFilterContainer,
} from './CellHeaderFixedEkfrequenz.module.css'

// TODO: replace imports
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
  height: 60px;
  &.column-hovered {
    background: hsla(120, 25%, 82%, 1) !important;
    font-weight: 700 !important;
  }
`
const StyledMenu = styled(Menu)`
  & .MuiPaper-root {
    overflow: hidden !important;
  }
`
const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

export const CellHeaderFixedEkfrequenz = observer(({ column }) => {
  const store = useContext(MobxContext)
  const {
    filterEkfrequenzEmpty,
    setFilterEmptyEkfrequenz,
    filterEkfrequenz,
    setFilterEkfrequenz,
  } = store.ekPlan

  const [anchorEl, setAnchorEl] = useState(null)

  const closeMenu = () => setAnchorEl(null)

  const onClickCell = (e) => setAnchorEl(e.currentTarget)

  const onClickFilterEmptyValues = () => {
    if (!filterEkfrequenzEmpty && filterEkfrequenz) {
      setFilterEkfrequenz(null)
    }
    setFilterEmptyEkfrequenz(!filterEkfrequenzEmpty)
    setAnchorEl(null)
  }

  const { label } = column

  return (
    <>
      <div
        className={cell}
        aria-controls="ekfrequenzHeaderMenu"
        aria-haspopup="true"
        onClick={onClickCell}
        width={column.width}
        style={{
          width: column.width,
          minWidth: column.width,
        }}
      >
        <div className={title}>{label}</div>
        <div className={dropdown}>
          {filterEkfrequenzEmpty || filterEkfrequenz ?
            <FaFilter className={faFilter} />
          : <Caret />}
        </div>
      </div>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={anchorOrigin}
      >
        <MenuItem
          onClick={onClickFilterEmptyValues}
          dense
        >
          {filterEkfrequenzEmpty ?
            'nicht Leerwerte filtern'
          : 'Leerwerte filtern'}
        </MenuItem>
        <div className={textFilterContainer}>
          <TextFilter
            column={column}
            closeMenu={closeMenu}
          />
        </div>
      </StyledMenu>
    </>
  )
})
