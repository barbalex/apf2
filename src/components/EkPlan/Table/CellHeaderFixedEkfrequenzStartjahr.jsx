import { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import { styled } from '@mui/material/styles'

import { MobxContext } from '../../../mobxContext.js'
import { TextFilter } from './CellHeaderFixed/TextFilter.jsx'
import {
  cell,
  title,
  dropdown,
  textFilterContainer,
} from './CellHeaderFixedEkfrequenz.module.css'
import { faFilter } from './CellHeaderFixedEkfrequenzStartjahr.module.css'

const StyledMenu = styled((props) => <Menu {...props} />)(() => ({
  '& .MuiPaper-root': {
    overflow: 'hidden !important',
  },
}))

const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

export const CellHeaderFixedEkfrequenzStartjahr = observer(({ column }) => {
  const store = useContext(MobxContext)
  const {
    filterEkfrequenzStartjahrEmpty,
    setFilterEmptyEkfrequenzStartjahr,
    filterEkfrequenzStartjahr,
    setFilterEkfrequenzStartjahr,
  } = store.ekPlan

  const [anchorEl, setAnchorEl] = useState(null)

  const closeMenu = () => setAnchorEl(null)

  const onClickCell = (e) => setAnchorEl(e.currentTarget)

  const onClickFilterEmptyValues = () => {
    if (!filterEkfrequenzStartjahrEmpty && filterEkfrequenzStartjahr) {
      setFilterEkfrequenzStartjahr(null)
    }
    setFilterEmptyEkfrequenzStartjahr(!filterEkfrequenzStartjahrEmpty)
    setAnchorEl(null)
  }

  const { label } = column

  return (
    <>
      <div
        className={cell}
        aria-controls="ekfrequenzStartjahrHeaderMenu"
        aria-haspopup="true"
        onClick={onClickCell}
        style={{
          width: column.width,
          minWidth: column.width,
        }}
      >
        <div className={title}>{label}</div>
        <div className={dropdown}>
          {filterEkfrequenzStartjahrEmpty || filterEkfrequenzStartjahr ?
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
          {filterEkfrequenzStartjahrEmpty ?
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
