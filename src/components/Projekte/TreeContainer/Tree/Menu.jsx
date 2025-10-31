import { useState, useContext } from 'react'
import { FaCog, FaCheck } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'

import {
  container,
  menu,
  section,
  title,
  item,
  checkIcon,
  faCog,
} from './Menu.module.css'

export const Menu = observer(() => {
  const store = useContext(MobxContext)
  const { map, tree } = store
  const { tpopIcon, setTpopIcon, popIcon, setPopIcon } = map
  const {
    showTpopIcon,
    toggleShowTpopIcon,
    setDoShowTpopIcon,
    showPopIcon,
    toggleShowPopIcon,
    setDoShowPopIcon,
  } = tree

  const [anchorEl, setAnchorEl] = useState(null)
  const onClickConfig = (event) => setAnchorEl(event.currentTarget)
  const onClose = () => setAnchorEl(null)

  const onClickAllTpopSame = () => {
    setTpopIcon('normal')
    setDoShowTpopIcon()
  }

  const onClickTpopByStatusGroup = () => {
    setTpopIcon('statusGroup')
    setDoShowTpopIcon()
  }

  const onClickTpopByStatusGroupSymbols = () => {
    setTpopIcon('statusGroupSymbols')
    setDoShowTpopIcon()
  }

  const onClickTpopNoSymbols = () => toggleShowTpopIcon()

  const onClickAllPopSame = () => {
    setPopIcon('normal')
    setDoShowPopIcon()
  }

  const onClickPopByStatusGroup = () => {
    setPopIcon('statusGroup')
    setDoShowPopIcon()
  }

  const onClickPopByStatusGroupSymbols = () => {
    setPopIcon('statusGroupSymbols')
    setDoShowPopIcon()
  }

  const onClickPopNoSymbols = () => toggleShowPopIcon()

  const [onlyShowActivePathString, setOnlyShowActivePath] =
    useSearchParamsState('onlyShowActivePath', 'false')
  const onlyShowActivePath = onlyShowActivePathString === 'true'

  const onClickOnlyShowActivePath = () =>
    setOnlyShowActivePath(!onlyShowActivePath)

  return (
    <div className={container}>
      <Tooltip title="Einstellungen">
        <IconButton
          size="small"
          aria-label="Optionen wählen"
          aria-owns={anchorEl ? 'menu' : null}
          onClick={onClickConfig}
        >
          <FaCog className={faCog} />
        </IconButton>
      </Tooltip>
      <MuiMenu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        className={menu}
      >
        <section className={section}>
          <MenuItem
            className={item}
            onClick={onClickOnlyShowActivePath}
          >
            {onlyShowActivePath && <FaCheck className={checkIcon} />}
            {`nur den aktiven Pfad anzeigen`}
          </MenuItem>
        </section>
        <section className={section}>
          <h4 className={title}>Symbole für Populationen:</h4>
          <MenuItem
            className={item}
            onClick={onClickAllPopSame}
          >
            {showPopIcon && popIcon === 'normal' && (
              <FaCheck className={checkIcon} />
            )}
            {`alle gleich (Blume)`}
          </MenuItem>
          <MenuItem
            className={item}
            onClick={onClickPopByStatusGroup}
          >
            {showPopIcon && popIcon === 'statusGroup' && (
              <FaCheck className={checkIcon} />
            )}
            {`nach Status, mit Buchstaben`}
          </MenuItem>
          <MenuItem
            className={item}
            onClick={onClickPopByStatusGroupSymbols}
          >
            {showPopIcon && popIcon === 'statusGroupSymbols' && (
              <FaCheck className={checkIcon} />
            )}
            {`nach Status, mit Symbolen`}
          </MenuItem>
          <MenuItem
            className={item}
            onClick={onClickPopNoSymbols}
          >
            {!showPopIcon && <FaCheck className={checkIcon} />}
            {`keine`}
          </MenuItem>
        </section>
        <section className={section}>
          <h4 className={title}>Symbole für Teil-Populationen:</h4>
          <MenuItem
            className={item}
            onClick={onClickAllTpopSame}
          >
            {showTpopIcon && tpopIcon === 'normal' && (
              <FaCheck className={checkIcon} />
            )}
            {`alle gleich (Blume)`}
          </MenuItem>
          <MenuItem
            className={item}
            onClick={onClickTpopByStatusGroup}
          >
            {showTpopIcon && tpopIcon === 'statusGroup' && (
              <FaCheck className={checkIcon} />
            )}
            {`nach Status, mit Buchstaben`}
          </MenuItem>
          <MenuItem
            className={item}
            onClick={onClickTpopByStatusGroupSymbols}
          >
            {showTpopIcon && tpopIcon === 'statusGroupSymbols' && (
              <FaCheck className={checkIcon} />
            )}
            {`nach Status, mit Symbolen`}
          </MenuItem>
          <MenuItem
            className={item}
            onClick={onClickTpopNoSymbols}
          >
            {!showTpopIcon && <FaCheck className={checkIcon} />}
            {`keine`}
          </MenuItem>
        </section>
      </MuiMenu>
    </div>
  )
})
