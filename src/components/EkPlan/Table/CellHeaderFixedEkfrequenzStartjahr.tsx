import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import { styled } from '@mui/material/styles'

import { TextFilter } from './CellHeaderFixed/TextFilter.tsx'
import {
  ekPlanFilterEkfrequenzStartjahrEmptyAtom,
  ekPlanSetFilterEmptyEkfrequenzStartjahrAtom,
  ekPlanFilterEkfrequenzStartjahrAtom,
  ekPlanSetFilterEkfrequenzStartjahrAtom,
} from '../../../store/index.ts'
import ekfrequenzStyles from './CellHeaderFixedEkfrequenz.module.css'
import styles from './CellHeaderFixedEkfrequenzStartjahr.module.css'

const StyledMenu = styled((props) => <Menu {...props} />)(() => ({
  '& .MuiPaper-root': {
    overflow: 'hidden !important',
  },
}))

const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

export const CellHeaderFixedEkfrequenzStartjahr = ({ column }) => {
  const filterEkfrequenzStartjahrEmpty = useAtomValue(
    ekPlanFilterEkfrequenzStartjahrEmptyAtom,
  )
  const setFilterEmptyEkfrequenzStartjahr = useSetAtom(
    ekPlanSetFilterEmptyEkfrequenzStartjahrAtom,
  )
  const filterEkfrequenzStartjahr = useAtomValue(
    ekPlanFilterEkfrequenzStartjahrAtom,
  )
  const setFilterEkfrequenzStartjahr = useSetAtom(
    ekPlanSetFilterEkfrequenzStartjahrAtom,
  )

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
        className={ekfrequenzStyles.cell}
        aria-controls="ekfrequenzStartjahrHeaderMenu"
        aria-haspopup="true"
        onClick={onClickCell}
        style={{
          width: column.width,
          minWidth: column.width,
        }}
      >
        <div className={ekfrequenzStyles.title}>{label}</div>
        <div className={ekfrequenzStyles.dropdown}>
          {filterEkfrequenzStartjahrEmpty || filterEkfrequenzStartjahr ?
            <FaFilter className={styles.faFilter} />
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
        <div className={ekfrequenzStyles.textFilterContainer}>
          <TextFilter
            column={column}
            closeMenu={closeMenu}
          />
        </div>
      </StyledMenu>
    </>
  )
}
