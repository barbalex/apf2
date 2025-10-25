import { useState, useContext } from 'react'
import styled from '@emotion/styled'
import { MdLocalFlorist } from 'react-icons/md'
import { FaCheck } from 'react-icons/fa'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../../../mobxContext.js'

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
const CheckIcon = styled(FaCheck)`
  padding-right: 5px;
`

export const PopIcon = observer(() => {
  const store = useContext(MobxContext)
  const { map } = store
  const { popIcon, setPopIcon, setPopLabel, popLabel } = map

  const [anchorEl, setAnchorEl] = useState(null)
  const onClickIconContainer = (e) => setAnchorEl(e.currentTarget)
  const onClose = () => setAnchorEl(null)

  const onClickAllSame = () => {
    setPopIcon('normal')
    onClose()
  }

  const onClickByStatusGroup = () => {
    setPopIcon('statusGroup')
    onClose()
  }

  const onClickByStatusGroupSymbols = () => {
    setPopIcon('statusGroupSymbols')
    onClose()
  }

  const onClickPopTpopNr = () => {
    setPopLabel('nr')
    onClose()
  }

  const onClickFlurname = () => {
    setPopLabel('name')
    onClose()
  }

  const onClickNoLabel = () => {
    setPopLabel('none')
    onClose()
  }

  return (
    <>
      <IconContainer
        aria-label="Symbole und Beschriftung wählen"
        aria-owns={anchorEl ? 'menu' : null}
        aria-haspopup="true"
        onClick={onClickIconContainer}
        title="Symbole und Beschriftung wählen"
        className="iconContainer"
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
        <StyledMenuItem onClick={onClickAllSame}>
          {popIcon === 'normal' && <CheckIcon />}
          {'alle gleich (Blume)'}
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickByStatusGroup}>
          {popIcon === 'statusGroup' && <CheckIcon />}
          {`nach Status, mit Buchstaben`}
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickByStatusGroupSymbols}>
          {popIcon === 'statusGroupSymbols' && <CheckIcon />}
          {`nach Status, mit Symbolen`}
        </StyledMenuItem>
        <MenuTitle>Beschriftung wählen:</MenuTitle>
        <StyledMenuItem onClick={onClickPopTpopNr}>
          {popLabel === 'nr' && <CheckIcon />}
          {'Nr.'}
        </StyledMenuItem>
        <StyledMenuItem onClick={onClickFlurname}>
          {popLabel === 'name' && <CheckIcon />}
          {'Name'}
        </StyledMenuItem>
        {/* TODO: add none to Markers */}
        <StyledMenuItem onClick={onClickNoLabel}>
          {popLabel === 'none' && <CheckIcon />}
          {`keine`}
        </StyledMenuItem>
      </Menu>
    </>
  )
})
