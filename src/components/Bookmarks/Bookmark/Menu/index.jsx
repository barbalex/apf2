import { memo, useState, useCallback } from 'react'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { BsCaretDown } from 'react-icons/bs'
import styled from '@emotion/styled'

import { Item } from './Item.jsx'

const StyledMenu = styled(MuiMenu)`
  .MuiPaper-root {
    scrollbar-width: thin !important;
  }
`

export const Menu = memo(({ navData }) => {
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
      <StyledMenu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': iconId,
        }}
      >
        {navData.menus.map((menu) => (
          <Item
            key={menu.id}
            menu={menu}
            baseUrl={navData.url}
            onClose={onClose}
          />
        ))}
      </StyledMenu>
    </>
  )
})
