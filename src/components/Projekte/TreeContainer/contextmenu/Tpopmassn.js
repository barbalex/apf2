// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject } from 'mobx-react'
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
  })
)

const Tpopmassn = (
  { store, onClick, treeName, changeLabel, label, onShow }:
  {store:Object,onClick:()=>void,treeName:string,changeLabel:()=>{},label:string|number,onShow:()=>void}
) =>
  <ContextMenu
    id={`${treeName}tpopmassn`}
    collect={props => props}
    onShow={onShow}
  >
    <div className="react-contextmenu-title">Massnahme</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopmassn`,
      }}
    >
      erstelle neue
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `tpopmassn`,
      }}
    >
      lösche
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `markForMoving`,
        table: `tpopmassn`,
      }}
    >
      verschiebe
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `markForCopying`,
        table: `tpopmassn`,
      }}
    >
      kopiere
    </MenuItem>
    {
      store.copying.table &&
      <MenuItem
        onClick={onClick}
        data={{
          action: `resetCopying`,
        }}
      >
        Kopieren aufheben
      </MenuItem>
    }
  </ContextMenu>

Tpopmassn.propTypes = {
  store: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  changeLabel: PropTypes.func.isRequired,
  label: PropTypes.any.isRequired,
  onShow: PropTypes.func.isRequired,
}

export default enhance(Tpopmassn)
