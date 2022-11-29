import React, { useState, useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import { MdLocalFlorist } from 'react-icons/md'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../../storeContext'

const MapIcon = styled(MdLocalFlorist)`
  margin-right: -0.1em;
  height: 20px !important;
  paint-order: stroke;
  stroke-width: 1px;
  stroke: black;
  color: #947500 !important;
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

const PopIcon = ({ treeName }) => {
  const store = useContext(storeContext)
  const { map } = store[treeName]
  const { setPopIcon, setPopLabel } = map
  const [anchorEl, setAnchorEl] = useState(null)
  const onClickIconContainer = useCallback(
    (e) => setAnchorEl(e.currentTarget),
    [],
  )
  const onClose = useCallback(() => setAnchorEl(null), [])
  const onClickAllSame = useCallback(() => {
    setPopIcon('normal')
    onClose()
  }, [onClose, setPopIcon])
  const onClickByStatusGroup = useCallback(() => {
    setPopIcon('statusGroup')
    onClose()
  }, [onClose, setPopIcon])
  const onClickPopTpopNr = useCallback(() => {
    setPopLabel('nr')
    onClose()
  }, [onClose, setPopLabel])
  const onClickFlurname = useCallback(() => {
    setPopLabel('name')
    onClose()
  }, [onClose, setPopLabel])

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
