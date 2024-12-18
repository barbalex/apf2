import {
  memo,
  useState,
  useCallback,
  useMemo,
  useContext,
  useRef,
  useEffect,
} from 'react'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { BsCaretDown } from 'react-icons/bs'
import styled from '@emotion/styled'
import { useResizeDetector } from 'react-resize-detector'
import { observer } from 'mobx-react-lite'
import { motion } from 'framer-motion'

import { Item } from './Item.jsx'
import { Title } from './Title/index.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { menuIsInActiveNodePath } from './menuIsInActiveNodePath.js'
import { usePrevious } from '../../../../modules/usePrevious.js'

const StyledIconButton = styled(IconButton)`
  z-index: 2;
`
const StyledMenu = styled(MuiMenu)`
  container-type: inline-size;
  .MuiPaper-root {
    scrollbar-width: thin !important;
    min-width: ${(props) => (props.minwidth ? `${props.minwidth}px` : 'unset')};
  }
  .MuiList-root {
    padding-top: 0;
  }
`

// do NOT use a MenuList. Reason: grabs key input to navigate to menu items
// thus filter input does not work

export const Menu = memo(
  observer(({ navData }) => {
    const store = useContext(MobxContext)
    const { nodeLabelFilter, activeFilterTable, activeNodeArray } = store.tree
    const filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''

    const [anchorEl, setAnchorEl] = useState(null)
    const previousAnchorEl = usePrevious(anchorEl)
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

    return (
      <>
        <StyledIconButton
          id={iconId}
          aria-controls={open ? menuId : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={onClick}
        >
          <BsCaretDown />
        </StyledIconButton>
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
  }),
)
