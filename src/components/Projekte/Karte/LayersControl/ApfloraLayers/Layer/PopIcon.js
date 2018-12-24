// @flow
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const MapIcon = styled(LocalFloristIcon)`
  margin-right: -0.1em;
  height: 20px !important;
  paint-order: stroke;
  stroke-width: 1px;
  stroke: black;
  color: #947500 !important;
`

const PopIcon = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const onClick = useCallback(e => setAnchorEl(e.currentTarget))
  const onClose = useCallback(() => setAnchorEl(null))

  return (
    <div
      aria-label="Mehr"
      aria-owns={anchorEl ? 'menu' : null}
      aria-haspopup="true"
      onClick={onClick}
    >
      <MapIcon id="PopMapIcon" onClick={onClick} />
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <MenuItem onClick={() => console.log('click')}>etwas</MenuItem>
      </Menu>
    </div>
  )
}

export default PopIcon
