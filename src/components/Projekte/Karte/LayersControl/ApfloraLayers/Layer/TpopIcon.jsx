import { useState, useContext } from 'react'
import { MdLocalFlorist } from 'react-icons/md'
import { FaCheck } from 'react-icons/fa'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../../../mobxContext.js'

import {
  mapIcon,
  mapIconColorTpop,
  iconContainer,
  menuTitle,
  menuItem,
  checkIcon,
} from './PopIcon.module.css'

export const TpopIcon = observer(() => {
  const store = useContext(MobxContext)
  const { map } = store
  const { tpopIcon, setTpopIcon, tpopLabel, setTpopLabel } = map

  const [anchorEl, setAnchorEl] = useState(null)
  const onClickIconContainer = (e) => setAnchorEl(e.currentTarget)
  const onClose = () => setAnchorEl(null)

  const onClickAllSame = () => {
    setTpopIcon('normal')
    onClose()
  }

  const onClickByStatusGroup = () => {
    setTpopIcon('statusGroup')
    onClose()
  }

  const onClickByStatusGroupSymbols = () => {
    setTpopIcon('statusGroupSymbols')
    onClose()
  }

  const onClickPopTpopNr = () => {
    setTpopLabel('nr')
    onClose()
  }

  const onClickFlurname = () => {
    setTpopLabel('name')
    onClose()
  }

  const onClickNoLabel = () => {
    setTpopLabel('none')
    onClose()
  }

  return (
    <>
      <div
        className={iconContainer}
        aria-label="Symbole und Beschriftung wählen"
        aria-owns={anchorEl ? 'menu' : null}
        aria-haspopup="true"
        onClick={onClickIconContainer}
        title="Symbole und Beschriftung wählen"
        className="iconContainer"
      >
        <MdLocalFlorist
          id="TpopMapIcon"
          className={`${mapIcon} ${mapIconColorTpop}`}
        />
      </div>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <div className={menuTitle}>Symbole wählen:</div>
        <MenuItem
          className={menuItem}
          onClick={onClickAllSame}
        >
          {tpopIcon === 'normal' && <FaCheck className={checkIcon} />}
          {`alle gleich (Blume)`}
        </MenuItem>
        <MenuItem
          className={menuItem}
          onClick={onClickByStatusGroup}
        >
          {tpopIcon === 'statusGroup' && <FaCheck className={checkIcon} />}
          {`nach Status, mit Buchstaben`}
        </MenuItem>
        <MenuItem
          className={menuItem}
          onClick={onClickByStatusGroupSymbols}
        >
          {tpopIcon === 'statusGroupSymbols' && (
            <FaCheck className={checkIcon} />
          )}
          {`nach Status, mit Symbolen`}
        </MenuItem>
        <div className={menuTitle}>Beschriftung wählen:</div>
        <MenuItem
          className={menuItem}
          onClick={onClickPopTpopNr}
        >
          {tpopLabel === 'nr' && <FaCheck className={checkIcon} />}
          {`Pop-Nr / TPop-Nr`}
        </MenuItem>
        <MenuItem
          className={menuItem}
          onClick={onClickFlurname}
        >
          {tpopLabel === 'name' && <FaCheck className={checkIcon} />}
          {`Flurname`}
        </MenuItem>
        <MenuItem
          className={menuItem}
          onClick={onClickNoLabel}
        >
          {tpopLabel === 'none' && <FaCheck className={checkIcon} />}
          {`keine`}
        </MenuItem>
      </Menu>
    </>
  )
})
