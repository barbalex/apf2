// @flow
import React, { useStore, useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import mobxStoreContext from '../../../../../../mobxStoreContext'

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
  padding: 5px 16px;
  color: grey;
  &:focus {
    outline: none;
  }
`

const PopIcon = ({ treeName }: { treeName: string }) => {
  const store = useContext(mobxStoreContext)
  const { map } = store[treeName]
  const { popIcon, setPopIcon } = map
  const [anchorEl, setAnchorEl] = useState(null)
  const onClick = useCallback(e => setAnchorEl(e.currentTarget))
  const onClose = useCallback(() => setAnchorEl(null))

  return (
    <>
      <IconContainer
        aria-label="Mehr"
        aria-owns={anchorEl ? 'menu' : null}
        aria-haspopup="true"
        onClick={onClick}
        title="Symbole wählen"
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
        <MenuItem
          onClick={e => {
            setPopIcon('normal')
            onClose()
          }}
        >
          alle gleich
        </MenuItem>
        <MenuItem
          onClick={e => {
            setPopIcon('statusGroup')
            onClose()
          }}
        >
          aktuell / ursprünglich / potentiell
        </MenuItem>
      </Menu>
    </>
  )
}

export default PopIcon
