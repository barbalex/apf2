import { useState } from 'react'
import Popover from '@mui/material/Popover'
import { MdInfoOutline } from 'react-icons/md'

import styles from './InfoWithPopover.module.css'

export const InfoWithPopover = ({ children, name }) => {
  const [popupOpen, changePopupOpen] = useState(false)
  const [popupAnchorEl, changePopupAnchorEl] = useState(null)

  const onClickFontIcon = (event) => {
    event.preventDefault()
    changePopupOpen(!popupOpen)
    changePopupAnchorEl(event.currentTarget)
  }

  const onRequestClosePopover = () => changePopupOpen(false)

  return (
    <>
      <MdInfoOutline
        data-id={`${name}-info-icon`}
        onClick={onClickFontIcon}
        className={styles.infoOutlineIcon}
      />
      <Popover
        open={popupOpen}
        anchorEl={popupAnchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={onRequestClosePopover}
        data-id="info-icon-popover"
        className={styles.popover}
      >
        {children}
      </Popover>
    </>
  )
}
