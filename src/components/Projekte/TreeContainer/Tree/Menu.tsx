import { useState, useContext } from 'react'
import { FaCog, FaCheck } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.ts'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.ts'

import styles from './Menu.module.css'

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
    <div className={styles.container}>
      <Tooltip title="Einstellungen">
        <IconButton
          size="small"
          aria-label="Optionen wählen"
          aria-owns={anchorEl ? 'menu' : null}
          onClick={onClickConfig}
        >
          <FaCog className={styles.faCog} />
        </IconButton>
      </Tooltip>
      <MuiMenu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        className={styles.menu}
      >
        <section className={styles.section}>
          <MenuItem
            className={styles.item}
            onClick={onClickOnlyShowActivePath}
          >
            {onlyShowActivePath && <FaCheck className={styles.checkIcon} />}
            {`nur den aktiven Pfad anzeigen`}
          </MenuItem>
        </section>
        <section className={styles.section}>
          <h4 className={styles.title}>Symbole für Populationen:</h4>
          <MenuItem
            className={styles.item}
            onClick={onClickAllPopSame}
          >
            {showPopIcon && popIcon === 'normal' && (
              <FaCheck className={styles.checkIcon} />
            )}
            {`alle gleich (Blume)`}
          </MenuItem>
          <MenuItem
            className={styles.item}
            onClick={onClickPopByStatusGroup}
          >
            {showPopIcon && popIcon === 'statusGroup' && (
              <FaCheck className={styles.checkIcon} />
            )}
            {`nach Status, mit Buchstaben`}
          </MenuItem>
          <MenuItem
            className={styles.item}
            onClick={onClickPopByStatusGroupSymbols}
          >
            {showPopIcon && popIcon === 'statusGroupSymbols' && (
              <FaCheck className={styles.checkIcon} />
            )}
            {`nach Status, mit Symbolen`}
          </MenuItem>
          <MenuItem
            className={styles.item}
            onClick={onClickPopNoSymbols}
          >
            {!showPopIcon && <FaCheck className={styles.checkIcon} />}
            {`keine`}
          </MenuItem>
        </section>
        <section className={styles.section}>
          <h4 className={styles.title}>Symbole für Teil-Populationen:</h4>
          <MenuItem
            className={styles.item}
            onClick={onClickAllTpopSame}
          >
            {showTpopIcon && tpopIcon === 'normal' && (
              <FaCheck className={styles.checkIcon} />
            )}
            {`alle gleich (Blume)`}
          </MenuItem>
          <MenuItem
            className={styles.item}
            onClick={onClickTpopByStatusGroup}
          >
            {showTpopIcon && tpopIcon === 'statusGroup' && (
              <FaCheck className={styles.checkIcon} />
            )}
            {`nach Status, mit Buchstaben`}
          </MenuItem>
          <MenuItem
            className={styles.item}
            onClick={onClickTpopByStatusGroupSymbols}
          >
            {showTpopIcon && tpopIcon === 'statusGroupSymbols' && (
              <FaCheck className={styles.checkIcon} />
            )}
            {`nach Status, mit Symbolen`}
          </MenuItem>
          <MenuItem
            className={styles.item}
            onClick={onClickTpopNoSymbols}
          >
            {!showTpopIcon && <FaCheck className={styles.checkIcon} />}
            {`keine`}
          </MenuItem>
        </section>
      </MuiMenu>
    </div>
  )
})
