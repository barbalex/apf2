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

const Apberuebersicht = (
  { onClick, changeLabel, label, onShow }:
  {onClick:()=>void,changeLabel:()=>{},label:string|number,onShow:()=>{}}
) =>
  <ContextMenu
    id="apberuebersicht"
    collect={props => props}
    onShow={onShow}
  >
    <div className="react-contextmenu-title">AP-Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `apberuebersicht`,
      }}
    >
      erstelle neuen
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `apberuebersicht`,
      }}
    >
      {`lösche "${label}"`}
    </MenuItem>
  </ContextMenu>

Apberuebersicht.propTypes = {
  onClick: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired,
  changeLabel: PropTypes.func.isRequired,
  label: PropTypes.any.isRequired,
}

export default enhance(Apberuebersicht)
