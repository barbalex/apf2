import { useState } from 'react'
import { useAtomValue } from 'jotai'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import { styled } from '@mui/material/styles'

import { Options } from './Options.tsx'
import {
  ekPlanFilterStatusAtom,
  ekPlanFilterPopStatusAtom,
} from '../../../../store/index.ts'

import ekfrequenzStyles from '../CellHeaderFixedEkfrequenz.module.css'
import styles from './index.module.css'

const StyledMenu = styled((props) => <Menu {...props} />)(() => ({
  '& .MuiPaper-root': {
    overflow: 'hidden !important',
  },
}))

const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

export const CellHeaderFixedTpopStatus = ({
  column,
  refetch,
  type = 'tpop',
}) => {
  const filterStatusAtom =
    type === 'tpop' ? ekPlanFilterStatusAtom : ekPlanFilterPopStatusAtom
  const filterStatus = useAtomValue(filterStatusAtom)

  const [anchorEl, setAnchorEl] = useState(null)

  const closeMenu = () => {
    setAnchorEl(null)
    // needed to update after changing tpop status
    refetch()
  }

  const onClickCell = (e) => setAnchorEl(e.currentTarget)

  const { label } = column

  return (
    <>
      <div
        className={ekfrequenzStyles.cell}
        aria-controls={`${type}StatusHeaderMenu`}
        aria-haspopup="true"
        onClick={onClickCell}
        style={{
          width: column.width,
          minWidth: column.width,
        }}
      >
        <div className={ekfrequenzStyles.title}>{label}</div>
        <div className={ekfrequenzStyles.dropdown}>
          {filterStatus?.length ?
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
        <div className={ekfrequenzStyles.textFilterContainer}>
          <Options type={type} />
        </div>
      </StyledMenu>
    </>
  )
}
