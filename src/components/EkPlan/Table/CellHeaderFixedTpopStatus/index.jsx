import { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import { styled } from '@mui/material/styles'

import { MobxContext } from '../../../../mobxContext.js'
import { Options } from './Options.jsx'

import {
  cell,
  title,
  dropdown,
  textFilterContainer,
} from '../CellHeaderFixedEkfrequenz.module.css'
import { faFilter } from './index.module.css'

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
          className={cell}
          aria-controls={`${type}StatusHeaderMenu`}
          aria-haspopup="true"
          onClick={onClickCell}
          style={{
            width: column.width,
            minWidth: column.width,
          }}
        >
          <div className={title}>{label}</div>
          <div className={dropdown}>
            {filterStatus?.length ?
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
          <div className={textFilterContainer}>
            <Options type={type} />
          </div>
        </StyledMenu>
      </>
    )
  },
)
