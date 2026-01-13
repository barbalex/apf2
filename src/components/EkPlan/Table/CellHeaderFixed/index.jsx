/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaSortDown as Caret, FaFilter } from 'react-icons/fa'
import { upperFirst } from 'es-toolkit'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { TextFilter } from './TextFilter.jsx'
import { BooleanFilter } from './BooleanFilter.jsx'

import styles from './index.module.css'

const anchorOrigin = { horizontal: 'left', vertical: 'bottom' }

export const CellHeaderFixed = observer(({ column }) => {
  const { name, label, nofilter } = column
  const store = useContext(MobxContext)

  const filterValue = store.ekPlan?.[`filter${upperFirst(name)}`]

  const [anchorEl, setAnchorEl] = useState(null)
  const closeMenu = () => setAnchorEl(null)
  const onClickCell = (e) => !anchorEl && setAnchorEl(e.currentTarget)

  const typeIsBoolean = ['ekfrequenzAbweichend'].includes(name)

  return (
    <>
      <div
        className={styles.cell}
        aria-controls={`${name}ColumnHeaderMenu`}
        aria-haspopup="true"
        onClick={onClickCell}
        style={{
          minWidth: column.width,
          maxWidth: column.width,
        }}
      >
        <div
          className={styles.title}
          data-label={label}
          style={{ ...(label === 'Art' ? { paddingLeft: 5 } : {}) }}
        >
          {label}
        </div>
        {!nofilter && (
          <div className={styles.dropdown}>
            {filterValue ?
              <FaFilter className={styles.faFilter} />
            : <Caret />}
          </div>
        )}
      </div>
      <Menu
        id={`${name}ColumnHeaderMenu`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={anchorOrigin}
      >
        {typeIsBoolean ?
          <BooleanFilter
            column={column}
            closeMenu={closeMenu}
          />
        : <MenuItem dense>
            <TextFilter
              column={column}
              closeMenu={closeMenu}
            />
          </MenuItem>
        }
      </Menu>
    </>
  )
})
