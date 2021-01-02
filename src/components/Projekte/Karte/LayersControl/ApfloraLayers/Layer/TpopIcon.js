import React, { useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { MdLocalFlorist } from 'react-icons/md'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../../storeContext'

const MapIcon = styled(MdLocalFlorist)`
  margin-right: -0.1em;
  height: 20px !important;
  paint-order: stroke;
  stroke-width: 1px;
  stroke: black;
  color: #016f19 !important;
  font-size: 1.5rem;
`
const IconContainer = styled.div`
  cursor: pointer;
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
  padding: 5px 14px !important;
`

const TpopIcon = ({ treeName }) => {
  const store = useContext(storeContext)
  const { map } = store[treeName]
  const { setTpopIcon, setTpopLabel } = map
  const [anchorEl, setAnchorEl] = useState(null)
  const onClickIconContainer = useCallback(
    (e) => setAnchorEl(e.currentTarget),
    [],
  )
  const onClose = useCallback(() => setAnchorEl(null), [])
  const onClickAllSame = useCallback(
    (e) => {
      setTpopIcon('normal')
      onClose()
    },
    [onClose, setTpopIcon],
  )
  const onClickByStatusGroup = useCallback(
    (e) => {
      setTpopIcon('statusGroup')
      onClose()
    },
    [onClose, setTpopIcon],
  )
  const onClickPopTpopNr = useCallback(
    (e) => {
      setTpopLabel('nr')
      onClose()
    },
    [onClose, setTpopLabel],
  )
  const onClickFlurname = useCallback(
    (e) => {
      setTpopLabel('name')
      onClose()
    },
    [onClose, setTpopLabel],
  )

  return (
    <>
      <IconContainer
        aria-label="Mehr"
        aria-owns={anchorEl ? 'menu' : null}
        aria-haspopup="true"
        onClick={onClickIconContainer}
        title="Symbole und Label wählen"
      >
        <MapIcon id="TpopMapIcon" />
      </IconContainer>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <MenuTitle>Symbole wählen:</MenuTitle>
        <StyledMenuItem onClick={onClickAllSame}>alle gleich</StyledMenuItem>
        <StyledMenuItem onClick={onClickByStatusGroup}>
          angesiedelt / ursprünglich / potentiell
        </StyledMenuItem>
        <MenuTitle>Beschriftung wählen:</MenuTitle>
        <StyledMenuItem onClick={onClickPopTpopNr}>
          Pop-Nr / TPop-Nr
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickFlurname}>Flurname</StyledMenuItem>
      </Menu>
    </>
  )
}

export default observer(TpopIcon)
