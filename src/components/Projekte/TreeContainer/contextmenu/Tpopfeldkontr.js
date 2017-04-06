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

const Tpopfeldkontr = (
  { onClick, treeName, changeLabel, label, onShow }:
  {onClick:()=>void,treeName:string,changeLabel:()=>{},label:string|number,onShow:()=>void}
) =>
  <ContextMenu
    id={`${treeName}tpopfeldkontr`}
    collect={props => props}
    onShow={onShow}
  >
    <div className="react-contextmenu-title">Feld-Kontrolle</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfeldkontr`,
      }}
    >
      erstelle neue
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `tpopfeldkontr`,
      }}
    >
      lösche
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `markForMoving`,
        table: `tpopfeldkontr`,
      }}
    >
      verschiebe
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `markForCopying`,
        table: `tpopfeldkontr`,
      }}
    >
      kopiere
    </MenuItem>
  </ContextMenu>

Tpopfeldkontr.propTypes = {
  onClick: PropTypes.func.isRequired,
  changeLabel: PropTypes.func.isRequired,
  label: PropTypes.any.isRequired,
  onShow: PropTypes.func.isRequired,
}

export default enhance(Tpopfeldkontr)
