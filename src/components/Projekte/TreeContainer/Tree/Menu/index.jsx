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
const MenuTitle = styled.div`
  font-size: 14px !important;
  padding: 2px 14px;
  font-weight: 700;
  &:focus {
    outline: none;
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
  const { tpopIcon, setTpopIcon } = map
  const { showTpopIcon, toggleShowTpopIcon, setDoShowTpopIcon } = tree

  const [anchorEl, setAnchorEl] = useState(null)
  const onClickConfig = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    [],
  )
  const onClose = useCallback(() => setAnchorEl(null), [])

  const onClickAllSame = useCallback(() => {
    setTpopIcon('normal')
    setDoShowTpopIcon()
    onClose()
  }, [onClose, setDoShowTpopIcon, setTpopIcon])
  const onClickByStatusGroup = useCallback(() => {
    setTpopIcon('statusGroup')
    setDoShowTpopIcon()
    onClose()
  }, [onClose, setDoShowTpopIcon, setTpopIcon])
  const onClickByStatusGroupSymbols = useCallback(() => {
    setTpopIcon('statusGroupSymbols')
    setDoShowTpopIcon()
    onClose()
  }, [onClose, setDoShowTpopIcon, setTpopIcon])
  const onClickNoSymbols = useCallback(() => {
    toggleShowTpopIcon()
    onClose()
  }, [onClose, toggleShowTpopIcon])

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
        <MenuTitle>Symbole für Teil-Populationen:</MenuTitle>
        <StyledMenuItem onClick={onClickAllSame}>
          {showTpopIcon && tpopIcon === 'normal' && <CheckIcon />}
          {`alle gleich (Blume)`}
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickByStatusGroup}>
          {showTpopIcon && tpopIcon === 'statusGroup' && <CheckIcon />}
          {`nach Status, mit Buchstaben`}
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickByStatusGroupSymbols}>
          {showTpopIcon && tpopIcon === 'statusGroupSymbols' && <CheckIcon />}
          {`nach Status, mit Symbolen`}
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickNoSymbols}>
          {!showTpopIcon && <CheckIcon />}
          {`keine`}
        </StyledMenuItem>
      </Menu>
    </Container>
  )
}

export default observer(TreeMenu)
