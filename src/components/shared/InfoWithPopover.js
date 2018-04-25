// @flow
import React, { Fragment } from 'react'
import { observer } from 'mobx-react'
import Popover from 'material-ui-next/Popover'

import InfoOutlineIcon from '@material-ui/icons/InfoOutline'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withState('popupOpen', 'changePopupOpen', false),
  withState('popupAnchorEl', 'changePopupAnchorEl', null),
  withHandlers({
    onClickFontIcon: props => event => {
      event.preventDefault()
      props.changePopupOpen(!props.popupOpen)
      props.changePopupAnchorEl(event.currentTarget)
    },
    onRequestClosePopover: props => () => props.changePopupOpen(false),
  }),
  observer
)

const StyledInfoOutlineIcon = styled(InfoOutlineIcon)`
  cursor: pointer;
  pointer-events: auto;
  padding-left: 5px;
`
const StyledPopover = styled(Popover)`
  border-radius: 4px;
`

const InfoWithPopover = ({
  popupOpen,
  popupAnchorEl,
  onRequestClosePopover,
  onClickFontIcon,
  children,
}: {
  popupOpen: boolean,
  popupAnchorEl?: Object,
  onRequestClosePopover: () => void,
  onClickFontIcon: () => void,
  children: Array<Object> | Object,
}) => (
  <Fragment>
    <StyledInfoOutlineIcon onClick={onClickFontIcon} />
    <StyledPopover
      open={popupOpen}
      anchorEl={popupAnchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
      transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onRequestClosePopover}
    >
      {children}
    </StyledPopover>
  </Fragment>
)

InfoWithPopover.defaultProps = {
  popupAnchorEl: null,
}

export default enhance(InfoWithPopover)
