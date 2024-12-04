import { memo, useState, useCallback, useMemo, useContext, useRef } from 'react'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { BsCaretDown } from 'react-icons/bs'
import styled from '@emotion/styled'
import { useResizeDetector } from 'react-resize-detector'
import { observer } from 'mobx-react-lite'

import { Item } from './Item.jsx'
import { Title } from './Title/index.jsx'
import { StoreContext } from '../../../../storeContext.js'

const StyledMenu = styled(MuiMenu)`
  container-type: inline-size;
  .MuiPaper-root {
    scrollbar-width: thin !important;
    scrollbar-gutter: stable;
    min-width: ${(props) => (props.minwidth ? `${props.minwidth}px` : 'unset')};
  }
`

// do NOT use a MenuList. Reason: grabs key input to navigate to menu items
// thus filter input does not work
const MenuListContainer = styled.div`
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

    const [filterInputIsVisible, setFilterInputIsVisible] =
      useState(!!filterValue)
    const filterInputRef = useRef(null)
    const toggleFilterInput = useCallback(() => {
      if (filterInputIsVisible) {
        setFilterInputIsVisible(false)
      } else {
        setFilterInputIsVisible(true)
        setTimeout(() => filterInputRef?.current?.focus?.(), 0)
      }
    }, [filterInputIsVisible])
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
            filterInputIsVisible={filterInputIsVisible}
            setTitleWidth={setTitleWidth}
            toggleFilterInput={toggleFilterInput}
            ref={filterInputRef}
          />
          <MenuListContainer
            ref={ref}
            margintop={filterInputIsVisible ? 100 : 40}
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
          </MenuListContainer>
        </StyledMenu>
      </>
    )
  }),
)
