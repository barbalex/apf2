// @flow
import React from 'react'
import { observer } from 'mobx-react'
import Popover from 'material-ui/Popover'
import FontIcon from 'material-ui/FontIcon'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withState(`popupOpen`, `changePopupOpen`, false),
  withState(`popupAnchorEl`, `changePopupAnchorEl`, null),
  withHandlers({
    onClickFontIcon: props => (event) => {
      event.preventDefault()
      props.changePopupOpen(!props.popupOpen)
      props.changePopupAnchorEl(event.currentTarget)
    },
    onRequestClosePopover: props => () =>
      props.changePopupOpen(false)
    ,
  }),
  observer
)

const StyledFontIcon = styled(FontIcon)`
  cursor: pointer;
  pointer-events: auto;
`
const StyledPopover = styled(Popover)`
  border-radius: 4px;
`

const InfoWithPopover = (
  {
    popupOpen,
    popupAnchorEl,
    onRequestClosePopover,
    onClickFontIcon,
    children,
  }:
  {
    popupOpen: boolean,
    popupAnchorEl?: Object,
    onRequestClosePopover: () => void,
    onClickFontIcon: () => void,
    children: Array<Object>|Object,
  }
) =>
  <div>
    <StyledFontIcon
      id="iconEl"
      className="material-icons"
      onClick={onClickFontIcon}
    >
      info_outline
    </StyledFontIcon>
    <StyledPopover
      open={popupOpen}
      anchorEl={popupAnchorEl}
      anchorOrigin={{ horizontal: `left`, vertical: `top` }}
      targetOrigin={{ horizontal: `left`, vertical: `bottom` }}
      animated
      autoCloseWhenOffScreen
      canAutoPosition
      onRequestClose={onRequestClosePopover}
    >
      {children}
    </StyledPopover>
  </div>

InfoWithPopover.defaultProps = {
  popupAnchorEl: null,
}

export default enhance(InfoWithPopover)
