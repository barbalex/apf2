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

const Erfkrit = (
  { onClick, treeName, changeLabel, label, onShow }:
  {onClick:()=>void,treeName:string,changeLabel:()=>{},label:string|number,onShow:()=>void}
) =>
  <ContextMenu
    id={treeName}
    collect={props => props}
    onShow={onShow}
  >
    <div className="react-contextmenu-title">AP-Erfolgskriterium</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `erfkrit`,
      }}
    >
      erstelle neues
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `erfkrit`,
      }}
    >
      lösche
    </MenuItem>
  </ContextMenu>

Erfkrit.propTypes = {
  onClick: PropTypes.func.isRequired,
  changeLabel: PropTypes.func.isRequired,
  label: PropTypes.any.isRequired,
  onShow: PropTypes.func.isRequired,
}

export default enhance(Erfkrit)
