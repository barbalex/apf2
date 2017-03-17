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
    ,
  }),
  observer
)

const Ap = (
  { onClick, store, changeLabel, label, onShow }:
  {onClick:() => void,store:Object,changeLabel:()=>{},label:string,onShow:()=>{}}
) =>
  <ContextMenu
    id="ap"
    collect={props => props}
    onShow={onShow}
  >
    <div className="react-contextmenu-title">Art</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `ap`,
      }}
    >
      erstelle neue
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `ap`,
      }}
    >
      {`lösche "${label}"`}
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
    {
      store.map.activeOverlays.includes(`pop`) &&
      <MenuItem
        onClick={onClick}
        data={{
          action: `toggleTooltip`,
          actionTable: `pop`,
        }}
      >
        {
          store.map.pop.labelUsingNr ?
          `beschrifte Populationen mit Namen` :
          `beschrifte Populationen mit Nummer`
        }
      </MenuItem>
    }
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
    {
      store.map.activeOverlays.includes(`tpop`) &&
      <MenuItem
        onClick={onClick}
        data={{
          action: `toggleTooltip`,
          actionTable: `tpop`,
        }}
      >
        {
          store.map.tpop.labelUsingNr ?
          `beschrifte Teil-Populationen mit Namen` :
          `beschrifte Teil-Populationen mit Nummer`
        }
      </MenuItem>
    }
  </ContextMenu>

Ap.propTypes = {
  onClick: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired,
  changeLabel: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
}

export default enhance(Ap)
