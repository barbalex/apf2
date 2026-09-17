import { useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import Popover from '@mui/material/Popover'
import { MdInfoOutline } from 'react-icons/md'

import styles from './InfoWithPopover.module.css'

export interface InfoWithPopoverProps {
  children?: ReactNode
  name?: string
}

export const InfoWithPopover = ({ children, name }: InfoWithPopoverProps) => {
  const [popupOpen, changePopupOpen] = useState(false)
  const [popupAnchorEl, changePopupAnchorEl] = useState<HTMLElement | null>(
    null,
  )

  const onClickFontIcon = (event: MouseEvent<SVGElement>) => {
    event.preventDefault()
    changePopupOpen(!popupOpen)
    changePopupAnchorEl(event.currentTarget as unknown as HTMLElement)
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
