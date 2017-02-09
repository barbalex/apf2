// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withState(`label`, `changeLabel`, ``),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => (event) =>
      props.changeLabel(event.detail.data.nodeLabel)
    ,
  })
)

const AssozartFolder = (
  { onClick, changeLabel, label, onShow }:
  {onClick:()=>void,changeLabel:()=>{},label:string,onShow:()=>void}
) =>
  <ContextMenu
    id="assozart"
    collect={props => props}
    onShow={onShow}
  >
    <div className="react-contextmenu-title">assoziierte Art</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `assozart`,
      }}
    >
      erstelle neue
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `assozart`,
      }}
    >
      {`lösche "${label}"`}
    </MenuItem>
  </ContextMenu>

AssozartFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
  changeLabel: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  onShow: PropTypes.func.isRequired,
}

export default enhance(AssozartFolder)
