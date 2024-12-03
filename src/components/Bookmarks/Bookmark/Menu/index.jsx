import { memo, useState, useCallback, useMemo } from 'react'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import { BsCaretDown } from 'react-icons/bs'
import styled from '@emotion/styled'
import { useResizeDetector } from 'react-resize-detector'

import { Item } from './Item.jsx'
import { Title } from './Title.jsx'

const StyledMenu = styled(MuiMenu)`
  .MuiPaper-root {
    scrollbar-width: thin !important;
  }
`
const StyledMenuList = styled(MenuList)`
  margin-top: 40px;
`

export const Menu = memo(({ navData }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const onClick = useCallback((event) => setAnchorEl(event.currentTarget), [])
  const onClose = useCallback(() => setAnchorEl(null), [])

  const iconId = `${navData.id}/MenuIcon`
  const menuId = `${navData.id}/Menu`

  const { width, ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 300,
    refreshOptions: { leading: false, trailing: true },
  })

  // TODO:
  // add filter symbol right of title
  // when filtering, add filter field below title
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
        <Title
          navData={navData}
          width={width}
        />
        <StyledMenuList ref={ref}>
          {navData.menus.map((menu) => (
            <Item
              key={menu.id}
              menu={menu}
              baseUrl={navData.url}
              onClose={onClose}
            />
          ))}
        </StyledMenuList>
      </StyledMenu>
    </>
  )
})
