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

const Tpopfeldkontr = (
  { store, tree, onClick, changeLabel, label, onShow }:
  {store:Object,tree:Object,onClick:()=>void,changeLabel:()=>{},label:string|number,onShow:()=>void}
) =>
  <ContextMenu
    id={`${tree.name}tpopfeldkontr`}
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

Tpopfeldkontr.propTypes = {
  store: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  changeLabel: PropTypes.func.isRequired,
  label: PropTypes.any.isRequired,
  onShow: PropTypes.func.isRequired,
}

export default enhance(Tpopfeldkontr)
