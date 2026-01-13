import { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import { styled } from '@mui/material/styles'

import { MobxContext } from '../../../../mobxContext.js'
import { Options } from './Options.jsx'

import ekfrequenzStyles from '../CellHeaderFixedEkfrequenz.module.css'
import styles from './index.module.css'

const StyledMenu = styled((props) => <Menu {...props} />)(() => ({
  '& .MuiPaper-root': {
    overflow: 'hidden !important',
  },
}))

const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

export const CellHeaderFixedTpopStatus = observer(
  ({ column, refetch, type = 'tpop' }) => {
    const store = useContext(MobxContext)
    const filterStatus =
      type === 'tpop' ? store.ekPlan.filterStatus : store.ekPlan.filterPopStatus

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
  },
)
