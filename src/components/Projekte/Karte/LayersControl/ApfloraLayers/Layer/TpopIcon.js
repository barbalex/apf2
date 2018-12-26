// @flow
import React, { useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { observer } from 'mobx-react-lite'

import mobxStoreContext from '../../../../../../mobxStoreContext'

const MapIcon = styled(LocalFloristIcon)`
  margin-right: -0.1em;
  height: 20px !important;
  paint-order: stroke;
  stroke-width: 1px;
  stroke: black;
  color: #016f19 !important;
`
const IconContainer = styled.div`
  cursor: pointer;
`
const MenuTitle = styled.div`
  padding: 5px 16px;
  color: grey;
  &:focus {
    outline: none;
  }
`

const TpopIcon = ({ treeName }: { treeName: string }) => {
  const store = useContext(mobxStoreContext)
  const { map } = store[treeName]
  const { setTpopIcon, setTpopLabel } = map
  const [anchorEl, setAnchorEl] = useState(null)
  const onClickIconContainer = useCallback(e => setAnchorEl(e.currentTarget))
  const onClose = useCallback(() => setAnchorEl(null))
  const onClickAllSame = useCallback(e => {
    setTpopIcon('normal')
    onClose()
  })
  const onClickByStatusGroup = useCallback(e => {
    setTpopIcon('statusGroup')
    onClose()
  })
  const onClickPopTpopNr = useCallback(e => {
    setTpopLabel('nr')
    onClose()
  })
  const onClickFlurname = useCallback(e => {
    setTpopLabel('name')
    onClose()
  })

  return (
    <>
      <IconContainer
        aria-label="Mehr"
        aria-owns={anchorEl ? 'menu' : null}
        aria-haspopup="true"
        onClick={onClickIconContainer}
        title="Symbole wählen"
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
        <MenuItem onClick={onClickAllSame}>alle gleich</MenuItem>
        <MenuItem onClick={onClickByStatusGroup}>
          aktuell / ursprünglich / potentiell
        </MenuItem>
        <MenuTitle>Beschriftung wählen:</MenuTitle>
        <MenuItem onClick={onClickPopTpopNr}>Pop-Nr / TPop-Nr</MenuItem>
        <MenuItem onClick={onClickFlurname}>Flurname</MenuItem>
      </Menu>
    </>
  )
}

export default observer(TpopIcon)
