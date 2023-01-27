import React, { useState, useCallback } from 'react'
import Popover from '@mui/material/Popover'

import { MdInfoOutline } from 'react-icons/md'
import styled from '@emotion/styled'

const StyledInfoOutlineIcon = styled(MdInfoOutline)`
  cursor: pointer;
  pointer-events: auto;
  padding-left: 5px;
  font-size: 1.5rem;
`
const StyledPopover = styled(Popover)`
  border-radius: 4px;
`

const InfoWithPopover = ({ children, name }) => {
  const [popupOpen, changePopupOpen] = useState(false)
  const [popupAnchorEl, changePopupAnchorEl] = useState(null)

  const onClickFontIcon = useCallback(
    (event) => {
      event.preventDefault()
      changePopupOpen(!popupOpen)
      changePopupAnchorEl(event.currentTarget)
    },
    [popupOpen],
  )
  const onRequestClosePopover = useCallback(() => changePopupOpen(false), [])

  return (
    <>
      <StyledInfoOutlineIcon
        data-id={`${name}-info-icon`}
        onClick={onClickFontIcon}
      />
      <StyledPopover
        open={popupOpen}
        anchorEl={popupAnchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={onRequestClosePopover}
        data-id="info-icon-popover"
      >
        {children}
      </StyledPopover>
    </>
  )
}

InfoWithPopover.defaultProps = {
  popupAnchorEl: null,
}

export default InfoWithPopover
