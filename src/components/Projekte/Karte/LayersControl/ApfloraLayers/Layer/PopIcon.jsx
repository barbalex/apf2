import { useState, useContext } from 'react'
import { MdLocalFlorist } from 'react-icons/md'
import { FaCheck } from 'react-icons/fa'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../../../mobxContext.js'

import {
  mapIcon,
  mapIconColorPop,
  iconContainer,
  menuTitle,
  menuItem,
  checkIcon,
} from './PopIcon.module.css'

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
      <div
        aria-label="Symbole und Beschriftung wählen"
        aria-owns={anchorEl ? 'menu' : null}
        aria-haspopup="true"
        onClick={onClickIconContainer}
        title="Symbole und Beschriftung wählen"
        className={`iconContainer ${iconContainer}`}
      >
        <MdLocalFlorist
          id="PopMapIcon"
          className={`${mapIcon} ${mapIconColorPop}`}
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
          onClick={onClickAllSame}
          className={menuItem}
        >
          {popIcon === 'normal' && <FaCheck className={checkIcon} />}
          {'alle gleich (Blume)'}
        </MenuItem>
        <MenuItem
          onClick={onClickByStatusGroup}
          className={menuItem}
        >
          {popIcon === 'statusGroup' && <FaCheck className={checkIcon} />}
          {`nach Status, mit Buchstaben`}
        </MenuItem>
        <MenuItem
          onClick={onClickByStatusGroupSymbols}
          className={menuItem}
        >
          {popIcon === 'statusGroupSymbols' && (
            <FaCheck className={checkIcon} />
          )}
          {`nach Status, mit Symbolen`}
        </MenuItem>
        <div className={menuTitle}>Beschriftung wählen:</div>
        <MenuItem
          onClick={onClickPopTpopNr}
          className={menuItem}
        >
          {popLabel === 'nr' && <FaCheck className={checkIcon} />}
          {'Nr.'}
        </MenuItem>
        <MenuItem
          onClick={onClickFlurname}
          className={menuItem}
        >
          {popLabel === 'name' && <FaCheck className={checkIcon} />}
          {'Name'}
        </MenuItem>
        {/* TODO: add none to Markers */}
        <MenuItem
          onClick={onClickNoLabel}
          className={menuItem}
        >
          {popLabel === 'none' && <FaCheck className={checkIcon} />}
          {`keine`}
        </MenuItem>
      </Menu>
    </>
  )
})
