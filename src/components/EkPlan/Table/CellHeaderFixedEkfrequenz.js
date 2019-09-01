import React, { useState, useCallback } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { StyledFixedHeaderCell } from './index'

/**
 * TODO:
 * enable "Filter: Leerwerte"
 */

const CellHeaderFixed = ({ style, column }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const closeMenu = useCallback(() => setAnchorEl(null), [])
  const handleClick = useCallback(e => setAnchorEl(e.currentTarget), [])

  const { label } = column

  return (
    <>
      <StyledFixedHeaderCell
        style={style}
        aria-controls="ekfrequenzHeaderMenu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <span>{label}</span>
      </StyledFixedHeaderCell>
      <Menu
        id="ekfrequenzHeaderMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem onClick={closeMenu}>Filter: Leerwerte</MenuItem>
      </Menu>
    </>
  )
}

export default CellHeaderFixed
