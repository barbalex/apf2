// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  inject(`store`),
  withState(`label`, `changeLabel`, ``),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => (event) =>
      props.changeLabel(event.detail.data.nodeLabel)
    },
  ),
  observer
)

const PopFolder = (
  { onClick, store, changeLabel, label, onShow }:
  {onClick:()=>void,store:Object,changeLabel:()=>{},label:string|number,onShow:()=>void}
) =>
  <ContextMenu
    id="popFolder"
    collect={props => props}
    onShow={onShow}
  >
    <div className="react-contextmenu-title">Populationen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `pop`,
      }}
    >
      erstelle neue
    </MenuItem>
    <div className="react-contextmenu-divider" />
    <div className="react-contextmenu-title">Karte</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showOnMap`,
        actionTable: `pop`,
        idTable: `ap`,
      }}
    >
      {`blende Populationen ${store.map.activeOverlays.includes(`pop`) ? `aus` : `ein`}`}
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showOnMap`,
        actionTable: `tpop`,
        idTable: `ap`,
      }}
    >
      {`blende Teil-Populationen ${store.map.activeOverlays.includes(`tpop`) ? `aus` : `ein`}`}
    </MenuItem>
  </ContextMenu>

PopFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
  changeLabel: PropTypes.func.isRequired,
  label: PropTypes.any.isRequired,
  onShow: PropTypes.func.isRequired,
}

export default enhance(PopFolder)
