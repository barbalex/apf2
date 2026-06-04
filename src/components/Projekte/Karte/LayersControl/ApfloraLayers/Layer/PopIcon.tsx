import { useState } from 'react'
import { MdLocalFlorist } from 'react-icons/md'
import { FaCheck } from 'react-icons/fa'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  mapPopIconAtom,
  setMapPopIconAtom,
  mapPopLabelAtom,
  setMapPopLabelAtom,
} from '../../../../../../store/index.ts'

import styles from './PopIcon.module.css'

export const PopIcon = () => {
  const popIcon = useAtomValue(mapPopIconAtom)
  const setPopIcon = useSetAtom(setMapPopIconAtom)
  const popLabel = useAtomValue(mapPopLabelAtom)
  const setPopLabel = useSetAtom(setMapPopLabelAtom)

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
        className={`iconContainer ${styles.iconContainer}`}
      >
        <MdLocalFlorist
          id="PopMapIcon"
          className={`${styles.mapIcon} ${styles.mapIconColorPop}`}
        />
      </div>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
      >
        <div className={styles.menuTitle}>Symbole wählen:</div>
        <MenuItem
          onClick={onClickAllSame}
          className={styles.menuItem}
        >
          {popIcon === 'normal' && <FaCheck className={styles.checkIcon} />}
          {'alle gleich (Blume)'}
        </MenuItem>
        <MenuItem
          onClick={onClickByStatusGroup}
          className={styles.menuItem}
        >
          {popIcon === 'statusGroup' && (
            <FaCheck className={styles.checkIcon} />
          )}
          {`nach Status, mit Buchstaben`}
        </MenuItem>
        <MenuItem
          onClick={onClickByStatusGroupSymbols}
          className={styles.menuItem}
        >
          {popIcon === 'statusGroupSymbols' && (
            <FaCheck className={styles.checkIcon} />
          )}
          {`nach Status, mit Symbolen`}
        </MenuItem>
        <div className={styles.menuTitle}>Beschriftung wählen:</div>
        <MenuItem
          onClick={onClickPopTpopNr}
          className={styles.menuItem}
        >
          {popLabel === 'nr' && <FaCheck className={styles.checkIcon} />}
          {'Nr.'}
        </MenuItem>
        <MenuItem
          onClick={onClickFlurname}
          className={styles.menuItem}
        >
          {popLabel === 'name' && <FaCheck className={styles.checkIcon} />}
          {'Name'}
        </MenuItem>
        {/* TODO: add none to Markers */}
        <MenuItem
          onClick={onClickNoLabel}
          className={styles.menuItem}
        >
          {popLabel === 'none' && <FaCheck className={styles.checkIcon} />}
          {`keine`}
        </MenuItem>
      </Menu>
    </>
  )
}
