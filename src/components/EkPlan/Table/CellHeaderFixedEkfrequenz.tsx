import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import { styled } from '@mui/material/styles'

import { TextFilter } from './CellHeaderFixed/TextFilter.tsx'
import {
  ekPlanFilterEkfrequenzEmptyAtom,
  ekPlanSetFilterEmptyEkfrequenzAtom,
  ekPlanFilterEkfrequenzAtom,
  ekPlanSetFilterEkfrequenzAtom,
} from '../../../store/index.ts'

import styles from './CellHeaderFixedEkfrequenz.module.css'

const StyledMenu = styled((props) => <Menu {...props} />)(() => ({
  '& .MuiPaper-root': {
    overflow: 'hidden !important',
  },
}))

const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

export const CellHeaderFixedEkfrequenz = ({ column }) => {
  const filterEkfrequenzEmpty = useAtomValue(ekPlanFilterEkfrequenzEmptyAtom)
  const setFilterEmptyEkfrequenz = useSetAtom(
    ekPlanSetFilterEmptyEkfrequenzAtom,
  )
  const filterEkfrequenz = useAtomValue(ekPlanFilterEkfrequenzAtom)
  const setFilterEkfrequenz = useSetAtom(ekPlanSetFilterEkfrequenzAtom)

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
        className={styles.cell}
        aria-controls="ekfrequenzHeaderMenu"
        aria-haspopup="true"
        onClick={onClickCell}
        style={{
          width: column.width,
          minWidth: column.width,
        }}
      >
        <div className={styles.title}>{label}</div>
        <div className={styles.dropdown}>
          {filterEkfrequenzEmpty || filterEkfrequenz ?
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
          {filterEkfrequenzEmpty ?
            'nicht Leerwerte filtern'
          : 'Leerwerte filtern'}
        </MenuItem>
        <div className={styles.textFilterContainer}>
          <TextFilter
            column={column}
            closeMenu={closeMenu}
          />
        </div>
      </StyledMenu>
    </>
  )
}
