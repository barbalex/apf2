import { memo, useState, useCallback } from 'react'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { BsCaretDown } from 'react-icons/bs'
import styled from '@emotion/styled'

export const Menu = memo(({ navData }) => {
  console.log('Menu', { navData })
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const onClick = useCallback((event) => setAnchorEl(event.currentTarget), [])
  const onClose = useCallback(() => setAnchorEl(null), [])

  const iconId = `${navData.id}/MenuIcon`
  const menuId = `${navData.id}/Menu`

  return (
    <>
      <IconButton
        id={iconId}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={onClick}
      >
        <BsCaretDown />
      </IconButton>
      <MuiMenu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': iconId,
        }}
      >
        <MenuItem onClick={onClose}>Profile</MenuItem>
        <MenuItem onClick={onClose}>My account</MenuItem>
        <MenuItem onClick={onClose}>Logout</MenuItem>
      </MuiMenu>
    </>
  )
})
