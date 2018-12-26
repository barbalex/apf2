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
        <MenuItem onClick={onClickAllSame}>alle gleich</MenuItem>
        <MenuItem onClick={onClickByStatusGroup}>
          aktuell / ursprünglich / potentiell
        </MenuItem>
        <MenuTitle>Beschriftung wählen:</MenuTitle>
        <MenuItem onClick={onClickPopTpopNr}>Nr.</MenuItem>
        <MenuItem onClick={onClickFlurname}>Name</MenuItem>
      </Menu>
    </>
  )
}

export default observer(PopIcon)
