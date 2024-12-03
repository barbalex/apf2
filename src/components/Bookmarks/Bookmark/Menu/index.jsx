import { memo, useState, useCallback, useMemo, useContext } from 'react'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import { BsCaretDown } from 'react-icons/bs'
import styled from '@emotion/styled'
import { useResizeDetector } from 'react-resize-detector'
import { observer } from 'mobx-react-lite'

import { Item } from './Item.jsx'
import { Title } from './Title/index.jsx'
import { StoreContext } from '../../../../storeContext.js'

const StyledMenu = styled(MuiMenu)`
  .MuiPaper-root {
    scrollbar-width: thin !important;
    min-width: ${(props) => (props.minwidth ? `${props.minwidth}px` : 'unset')};
  }
`
// TODO: depends on whether filter input is visible
const StyledMenuList = styled(MenuList)`
  margin-top: ${(props) => props.margintop}px;
  min-width: ${(props) => (props.minwidth ? `${props.minwidth}px` : 'unset')};
`

export const Menu = memo(
  observer(({ navData }) => {
    const store = useContext(StoreContext)
    const { nodeLabelFilter, activeFilterTable } = store.tree
    const filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''

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

    const [isFiltering, setIsFiltering] = useState(!!filterValue)
    const [titleWidth, setTitleWidth] = useState(0)

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
          minwidth={titleWidth}
        >
          <Title
            navData={navData}
            width={width}
            isFiltering={isFiltering}
            setIsFiltering={setIsFiltering}
            setTitleWidth={setTitleWidth}
          />
          <StyledMenuList
            ref={ref}
            margintop={isFiltering ? 92 : 40}
            minwidth={titleWidth}
          >
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
  }),
)
