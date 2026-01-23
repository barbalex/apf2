import { useState } from 'react'
import { FaCog, FaCheck } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { useAtomValue, useSetAtom } from 'jotai'

import { useSearchParamsState } from '../../../../modules/useSearchParamsState.ts'
import {
  mapTpopIconAtom,
  setMapTpopIconAtom,
  mapPopIconAtom,
  setMapPopIconAtom,
  treeShowPopIconAtom,
  toggleTreeShowPopIconAtom,
  setTreeShowPopIconAtom,
  treeShowTpopIconAtom,
  toggleTreeShowTpopIconAtom,
  setTreeShowTpopIconAtom,
} from '../../../../store/index.ts'

import styles from './Menu.module.css'

export const Menu = () => {
  const tpopIcon = useAtomValue(mapTpopIconAtom)
  const setTpopIcon = useSetAtom(setMapTpopIconAtom)
  const popIcon = useAtomValue(mapPopIconAtom)
  const setPopIcon = useSetAtom(setMapPopIconAtom)
  const showTpopIcon = useAtomValue(treeShowTpopIconAtom)
  const toggleShowTpopIcon = useSetAtom(toggleTreeShowTpopIconAtom)
  const setDoShowTpopIcon = useSetAtom(setTreeShowTpopIconAtom)
  const showPopIcon = useAtomValue(treeShowPopIconAtom)
  const toggleShowPopIcon = useSetAtom(toggleTreeShowPopIconAtom)
  const setDoShowPopIcon = useSetAtom(setTreeShowPopIconAtom)

  const [anchorEl, setAnchorEl] = useState(null)
  const onClickConfig = (event) => setAnchorEl(event.currentTarget)
  const onClose = () => setAnchorEl(null)

  const onClickAllTpopSame = () => {
    setTpopIcon('normal')
    setDoShowTpopIcon(true)
  }

  const onClickTpopByStatusGroup = () => {
    setTpopIcon('statusGroup')
    setDoShowTpopIcon(true)
  }

  const onClickTpopByStatusGroupSymbols = () => {
    setTpopIcon('statusGroupSymbols')
    setDoShowTpopIcon(true)
  }

  const onClickTpopNoSymbols = () => toggleShowTpopIcon()

  const onClickAllPopSame = () => {
    setPopIcon('normal')
    setDoShowPopIcon(true)
  }

  const onClickPopByStatusGroup = () => {
    setPopIcon('statusGroup')
    setDoShowPopIcon(true)
  }

  const onClickPopByStatusGroupSymbols = () => {
    setPopIcon('statusGroupSymbols')
    setDoShowPopIcon(true)
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
}
