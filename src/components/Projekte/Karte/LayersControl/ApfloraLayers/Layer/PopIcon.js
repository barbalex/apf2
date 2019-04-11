import React, { useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../../storeContext'

const MapIcon = styled(LocalFloristIcon)`
  margin-right: -0.1em;
  height: 20px !important;
  paint-order: stroke;
  stroke-width: 1px;
  stroke: black;
  color: #947500 !important;
`
const IconContainer = styled.div`
  cursor: pointer;
`
const MenuTitle = styled.div`
  font-size: 14px !important;
  padding: 2px 14px;
  font-weight: 600;
  &:focus {
    outline: none;
  }
`
const StyledMenuItem = styled(MenuItem)`
  font-size: 14px !important;
  padding: 5px 14px !important;
`

const PopIcon = ({ treeName }) => {
  const store = useContext(storeContext)
  const { map } = store[treeName]
  const { setPopIcon, setPopLabel } = map
  const [anchorEl, setAnchorEl] = useState(null)
  const onClickIconContainer = useCallback(e => setAnchorEl(e.currentTarget))
  const onClose = useCallback(() => setAnchorEl(null))
  const onClickAllSame = useCallback(e => {
    setPopIcon('normal')
    onClose()
  })
  const onClickByStatusGroup = useCallback(e => {
    setPopIcon('statusGroup')
    onClose()
  })
  const onClickPopTpopNr = useCallback(e => {
    setPopLabel('nr')
    onClose()
  })
  const onClickFlurname = useCallback(e => {
    setPopLabel('name')
    onClose()
  })

  return (
    <>
      <IconContainer
        aria-label="Mehr"
        aria-owns={anchorEl ? 'menu' : null}
        aria-haspopup="true"
        onClick={onClickIconContainer}
        title="Symbole und Label wählen"
      >
        <MapIcon id="PopMapIcon" />
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
        <StyledMenuItem onClick={onClickPopTpopNr}>Nr.</StyledMenuItem>
        <StyledMenuItem onClick={onClickFlurname}>Name</StyledMenuItem>
      </Menu>
    </>
  )
}

export default observer(PopIcon)
