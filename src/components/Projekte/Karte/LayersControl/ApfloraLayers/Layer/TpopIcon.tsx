import { useState, useContext } from 'react'
import { MdLocalFlorist } from 'react-icons/md'
import { FaCheck } from 'react-icons/fa'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../../../mobxContext.ts'

import styles from './PopIcon.module.css'

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
        aria-label="Symbole und Beschriftung wählen"
        aria-owns={anchorEl ? 'menu' : null}
        aria-haspopup="true"
        onClick={onClickIconContainer}
        title="Symbole und Beschriftung wählen"
        className={`iconContainer ${styles.iconContainer}`}
      >
        <MdLocalFlorist
          id="TpopMapIcon"
          className={`${styles.mapIcon} ${styles.mapIconColorTpop}`}
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
          className={styles.menuItem}
          onClick={onClickAllSame}
        >
          {tpopIcon === 'normal' && <FaCheck className={styles.checkIcon} />}
          {`alle gleich (Blume)`}
        </MenuItem>
        <MenuItem
          className={styles.menuItem}
          onClick={onClickByStatusGroup}
        >
          {tpopIcon === 'statusGroup' && <FaCheck className={styles.checkIcon} />}
          {`nach Status, mit Buchstaben`}
        </MenuItem>
        <MenuItem
          className={styles.menuItem}
          onClick={onClickByStatusGroupSymbols}
        >
          {tpopIcon === 'statusGroupSymbols' && (
            <FaCheck className={styles.checkIcon} />
          )}
          {`nach Status, mit Symbolen`}
        </MenuItem>
        <div className={styles.menuTitle}>Beschriftung wählen:</div>
        <MenuItem
          className={styles.menuItem}
          onClick={onClickPopTpopNr}
        >
          {tpopLabel === 'nr' && <FaCheck className={styles.checkIcon} />}
          {`Pop-Nr / TPop-Nr`}
        </MenuItem>
        <MenuItem
          className={styles.menuItem}
          onClick={onClickFlurname}
        >
          {tpopLabel === 'name' && <FaCheck className={styles.checkIcon} />}
          {`Flurname`}
        </MenuItem>
        <MenuItem
          className={styles.menuItem}
          onClick={onClickNoLabel}
        >
          {tpopLabel === 'none' && <FaCheck className={styles.checkIcon} />}
          {`keine`}
        </MenuItem>
      </Menu>
    </>
  )
})
