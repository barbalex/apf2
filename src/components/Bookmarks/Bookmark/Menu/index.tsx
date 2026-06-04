import { useState, useRef, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import { BsCaretDown } from 'react-icons/bs'
import { useResizeDetector } from 'react-resize-detector'
import { motion } from 'framer-motion'
import { useAtomValue } from 'jotai'

import { Item } from './Item.tsx'
import { Title } from './Title/index.tsx'
import {
  treeActiveNodeArrayAtom,
  treeActiveFilterTableAtom,
  treeNodeLabelFilterAtom,
  store,
} from '../../../../store/index.ts'
import { menuIsInActiveNodePath } from './menuIsInActiveNodePath.ts'
import { usePrevious } from '../../../../modules/usePrevious.ts'

import styles from './index.module.css'

// https://mui.com/material-ui/react-menu/#customization
const StyledMenu = styled((props) => <MuiMenu {...props} />)(() => ({
  '& .MuiPaper-root': {
    scrollbarWidth: 'thin',
    minWidth: (props) => (props.minwidth ? `${props.minwidth}px` : 'unset'),
  },
  '& .MuiList-root': {
    paddingTop: 0,
  },
}))

// do NOT use a MenuList. Reason: grabs key input to navigate to menu items
// thus filter input does not work

export const Menu = ({ navData }) => {
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const activeFilterTable = store.get(treeActiveFilterTableAtom)
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)

  const filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''

  const [anchorEl, setAnchorEl] = useState(null)
  const previousAnchorEl = usePrevious(anchorEl)
  const open = Boolean(anchorEl)
  const onClick = (event) => setAnchorEl(event.currentTarget)
  const onClose = () => setAnchorEl(null)

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
          width={width}
          filterInputIsVisible={filterInputIsVisible}
          toggleFilterInput={toggleFilterInput}
          ref={filterInputRef}
          setTitleWidth={setTitleWidth}
        />
        <motion.div
          ref={ref}
          minwidth={titleWidth}
          style={{ minWidth: titleWidth ?? 'unset' }}
          initial={{
            marginTop:
              previousAnchorEl === null ? 40
              : filterInputIsVisible ? 40
              : 100,
          }}
          animate={{ marginTop: filterInputIsVisible ? 100 : 40 }}
          transition={{ duration: 0.2, delay: 0, ease: 'linear' }}
        >
          {navData.menus.map((menu) => (
            <Item
              key={menu.id}
              menu={menu}
              baseUrl={navData.url}
              onClose={onClose}
            />
          ))}
        </motion.div>
      </StyledMenu>
    </>
  )
}
