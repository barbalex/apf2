import { useState, useCallback, useContext } from 'react'
import { FaCog, FaCheck } from 'react-icons/fa'
import styled from '@emotion/styled'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../storeContext'

const Container = styled.div`
  position: absolute;
  top: -2px;
  right: 6px;
`
const MenuTitle = styled.h4`
  font-size: 14px !important;
  padding: 2px 14px;
  margin: 0;
  font-weight: 700;
  &:focus {
    outline: none;
  }
  &:not(:first-of-type) {
    padding-top: 8px;
  }
`
const StyledMenuItem = styled(MenuItem)`
  font-size: 14px !important;
  padding: 5px 14px 5px 15px !important;
`
const CheckIcon = styled(FaCheck)`
  padding-right: 5px;
  color: #2e7d32;
`
const StyledFaCog = styled(FaCog)`
  color: #2e7d32;
`

const TreeMenu = () => {
  const store = useContext(storeContext)
  const { map, tree } = store
  const { tpopIcon, setTpopIcon, popIcon, setPopIcon } = map
  const {
    showTpopIcon,
    toggleShowTpopIcon,
    setDoShowTpopIcon,
    showPopIcon,
    toggleShowPopIcon,
    setDoShowPopIcon,
  } = tree

  const [anchorEl, setAnchorEl] = useState(null)
  const onClickConfig = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    [],
  )
  const onClose = useCallback(() => setAnchorEl(null), [])

  const onClickAllTpopSame = useCallback(() => {
    setTpopIcon('normal')
    setDoShowTpopIcon()
    onClose()
  }, [onClose, setDoShowTpopIcon, setTpopIcon])
  const onClickTpopByStatusGroup = useCallback(() => {
    setTpopIcon('statusGroup')
    setDoShowTpopIcon()
    onClose()
  }, [onClose, setDoShowTpopIcon, setTpopIcon])
  const onClickTpopByStatusGroupSymbols = useCallback(() => {
    setTpopIcon('statusGroupSymbols')
    setDoShowTpopIcon()
    onClose()
  }, [onClose, setDoShowTpopIcon, setTpopIcon])
  const onClickTpopNoSymbols = useCallback(() => {
    toggleShowTpopIcon()
    onClose()
  }, [onClose, toggleShowTpopIcon])

  const onClickAllPopSame = useCallback(() => {
    setPopIcon('normal')
    setDoShowPopIcon()
    onClose()
  }, [onClose, setDoShowPopIcon, setPopIcon])
  const onClickPopByStatusGroup = useCallback(() => {
    setPopIcon('statusGroup')
    setDoShowPopIcon()
    onClose()
  }, [onClose, setDoShowPopIcon, setPopIcon])
  const onClickPopByStatusGroupSymbols = useCallback(() => {
    setPopIcon('statusGroupSymbols')
    setDoShowPopIcon()
    onClose()
  }, [onClose, setDoShowPopIcon, setPopIcon])
  const onClickPopNoSymbols = useCallback(() => {
    toggleShowPopIcon()
    onClose()
  }, [onClose, toggleShowPopIcon])

  return (
    <Container>
      <IconButton
        size="small"
        title="Einstellungen"
        aria-label="Optionen wählen"
        aria-owns={anchorEl ? 'menu' : null}
        onClick={onClickConfig}
      >
        <StyledFaCog />
      </IconButton>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <MenuTitle>Symbole für Populationen:</MenuTitle>
        <StyledMenuItem onClick={onClickAllPopSame}>
          {showPopIcon && popIcon === 'normal' && <CheckIcon />}
          {`alle gleich (Blume)`}
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickPopByStatusGroup}>
          {showPopIcon && popIcon === 'statusGroup' && <CheckIcon />}
          {`nach Status, mit Buchstaben`}
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickPopByStatusGroupSymbols}>
          {showPopIcon && popIcon === 'statusGroupSymbols' && <CheckIcon />}
          {`nach Status, mit Symbolen`}
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickPopNoSymbols}>
          {!showPopIcon && <CheckIcon />}
          {`keine`}
        </StyledMenuItem>
        <MenuTitle>Symbole für Teil-Populationen:</MenuTitle>
        <StyledMenuItem onClick={onClickAllTpopSame}>
          {showTpopIcon && tpopIcon === 'normal' && <CheckIcon />}
          {`alle gleich (Blume)`}
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickTpopByStatusGroup}>
          {showTpopIcon && tpopIcon === 'statusGroup' && <CheckIcon />}
          {`nach Status, mit Buchstaben`}
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickTpopByStatusGroupSymbols}>
          {showTpopIcon && tpopIcon === 'statusGroupSymbols' && <CheckIcon />}
          {`nach Status, mit Symbolen`}
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickTpopNoSymbols}>
          {!showTpopIcon && <CheckIcon />}
          {`keine`}
        </StyledMenuItem>
      </Menu>
    </Container>
  )
}

export default observer(TreeMenu)
