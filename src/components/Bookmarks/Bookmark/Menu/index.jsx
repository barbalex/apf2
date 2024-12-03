import { memo, useState, useCallback } from 'react'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { BsCaretDown } from 'react-icons/bs'
import { MdFilterAlt } from 'react-icons/md'
import styled from '@emotion/styled'
import { useResizeDetector } from 'react-resize-detector'

import { Item } from './Item.jsx'

const StyledMenu = styled(MuiMenu)`
  .MuiPaper-root {
    scrollbar-width: thin !important;
  }
`
const MenuTitleRow = styled.div`
  position: relative;
  z-index: 1;
  margin-top: -8px;
`
const MenuTitle = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-bottom: 0.6666667px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  font-weight: bold;
  opacity: 1 !important;
  width: ${(props) => props.width}px;
`
const Title = styled.div`
  padding-left: 16px;
  user-select: none;
  cursor: default;
`
const StyledMenuList = styled(MenuList)`
  margin-top: 50px;
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
        <MenuTitleRow>
          <MenuTitle width={width}>
            <Title>{navData.label}</Title>
            <Tooltip title="Filtern">
              <IconButton
                aria-label="Filtern"
                onClick={() => {
                  console.log('Filtern')
                }}
              >
                <MdFilterAlt />
              </IconButton>
            </Tooltip>
          </MenuTitle>
        </MenuTitleRow>
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
