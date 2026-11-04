import { useState, useRef } from 'react'

import type { NavData } from '../../types.ts'
import IconButton from '@mui/material/IconButton'
import MuiMenu, { type MenuProps as MuiMenuProps } from '@mui/material/Menu'
import { styled } from '@mui/material/styles'
import { BsCaretDown } from 'react-icons/bs'
import { useElementSize } from '../../../../modules/useElementSize.ts'

import { Item } from './Item.tsx'
import { Title } from './Title/index.tsx'
import {
  treeActiveFilterTableAtom,
  treeNodeLabelFilterAtom,
  store,
} from '../../../../store/index.ts'

import styles from './index.module.css'

// https://mui.com/material-ui/react-menu/#customization
interface StyledMenuProps extends MuiMenuProps {
  minwidth?: number
}

const StyledMenu = styled((props: StyledMenuProps) => <MuiMenu {...props} />)(
  (props: StyledMenuProps) => ({
  '& .MuiPaper-root': {
    scrollbarWidth: 'thin',
    minWidth: props.minwidth ? `${props.minwidth}px` : 'unset',
  },
  '& .MuiList-root': {
    paddingTop: 0,
  },
}))

// do NOT use a MenuList. Reason: grabs key input to navigate to menu items
// thus filter input does not work

export const Menu = ({ navData }: { navData: NavData }) => {
  const activeFilterTable = store.get(treeActiveFilterTableAtom)
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)

  const filterValue = activeFilterTable ? (nodeLabelFilter[activeFilterTable] ?? '') : ''

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)
  const onClose = () => setAnchorEl(null)

  const iconId = `${navData.id}/MenuIcon`
  const menuId = `${navData.id}/Menu`

  const { width, ref } = useElementSize({
    handleHeight: false,
    debounceMs: 300,
  })

  const [filterInputIsVisible, setFilterInputIsVisible] =
    useState(!!filterValue)
  const filterInputRef = useRef<HTMLInputElement | null>(null)
  const toggleFilterInput = () => {
    if (filterInputIsVisible) {
      setFilterInputIsVisible(false)
    } else {
      setFilterInputIsVisible(true)
      setTimeout(() => filterInputRef?.current?.focus?.(), 0)
    }
  }
  const [titleWidth, setTitleWidth] = useState(0)

  return (
    <>
      <IconButton
        id={iconId}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={onClick}
        className={styles.iconButton}
      >
        <BsCaretDown />
      </IconButton>
      <StyledMenu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        slotProps={{
          list: {
            'aria-labelledby': iconId,
          },
        }}
        minwidth={titleWidth}
      >
        <Title
          navData={navData}
          width={width ?? undefined}
          filterInputIsVisible={filterInputIsVisible}
          toggleFilterInput={toggleFilterInput}
          ref={filterInputRef ?? undefined}
          setTitleWidth={setTitleWidth}
        />
        <div
          ref={ref}
          className={styles.items}
          style={{
            minWidth: titleWidth ?? 'unset',
            marginTop: filterInputIsVisible ? 100 : 40,
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
        </div>
      </StyledMenu>
    </>
  )
}
