import { memo, useState, useCallback, useContext } from 'react'
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
const CheckIcon = styled(FaCheck)`
  padding-right: 5px;
`

export const TpopIcon = memo(
  observer(() => {
    const store = useContext(MobxContext)
    const { map } = store
    const { tpopIcon, setTpopIcon, tpopLabel, setTpopLabel } = map

    const [anchorEl, setAnchorEl] = useState(null)
    const onClickIconContainer = useCallback(
      (e) => setAnchorEl(e.currentTarget),
      [],
    )
    const onClose = useCallback(() => setAnchorEl(null), [])

    const onClickAllSame = useCallback(() => {
      setTpopIcon('normal')
      onClose()
    }, [onClose, setTpopIcon])
    const onClickByStatusGroup = useCallback(() => {
      setTpopIcon('statusGroup')
      onClose()
    }, [onClose, setTpopIcon])
    const onClickByStatusGroupSymbols = useCallback(() => {
      setTpopIcon('statusGroupSymbols')
      onClose()
    }, [onClose, setTpopIcon])
    const onClickPopTpopNr = useCallback(() => {
      setTpopLabel('nr')
      onClose()
    }, [onClose, setTpopLabel])
    const onClickFlurname = useCallback(() => {
      setTpopLabel('name')
      onClose()
    }, [onClose, setTpopLabel])
    const onClickNoLabel = useCallback(() => {
      setTpopLabel('none')
      onClose()
    }, [onClose, setTpopLabel])

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
          <MapIcon id="TpopMapIcon" />
        </IconContainer>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onClose}
        >
          <MenuTitle>Symbole wählen:</MenuTitle>
          <StyledMenuItem onClick={onClickAllSame}>
            {tpopIcon === 'normal' && <CheckIcon />}
            {`alle gleich (Blume)`}
          </StyledMenuItem>
          <StyledMenuItem onClick={onClickByStatusGroup}>
            {tpopIcon === 'statusGroup' && <CheckIcon />}
            {`nach Status, mit Buchstaben`}
          </StyledMenuItem>
          <StyledMenuItem onClick={onClickByStatusGroupSymbols}>
            {tpopIcon === 'statusGroupSymbols' && <CheckIcon />}
            {`nach Status, mit Symbolen`}
          </StyledMenuItem>
          <MenuTitle>Beschriftung wählen:</MenuTitle>
          <StyledMenuItem onClick={onClickPopTpopNr}>
            {tpopLabel === 'nr' && <CheckIcon />}
            {`Pop-Nr / TPop-Nr`}
          </StyledMenuItem>
          <StyledMenuItem onClick={onClickFlurname}>
            {tpopLabel === 'name' && <CheckIcon />}
            {`Flurname`}
          </StyledMenuItem>
          <StyledMenuItem onClick={onClickNoLabel}>
            {tpopLabel === 'none' && <CheckIcon />}
            {`keine`}
          </StyledMenuItem>
        </Menu>
      </>
    )
  }),
)
