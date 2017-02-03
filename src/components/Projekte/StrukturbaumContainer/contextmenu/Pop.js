// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  inject(`store`),
  withState(`id`, `changeId`, 0),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => (event) =>
      props.changeId(event.detail.data.nodeId)
    ,
  }),
  observer
)

const Pop = (
  { onClick, store, changeId, id, onShow }:
  {onClick:() => void,store:Object,changeId:()=>{},id:number,onShow:()=>{}}
) =>
  <ContextMenu
    id="pop"
    collect={props => props}
    onShow={onShow}
  >
    <div className="react-contextmenu-title">Population</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `pop`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `pop`,
      }}
    >
      löschen
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `highlightOnMap`,
        actionTable: `pop`,
        idTable: `pop`,
      }}
    >
      {
        store.map.layer.pop.highlightedIds.includes(id) ?
        `Hervorhebung der Population aufheben` :
        `Population in Karte hervorheben`
      }
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showOnMap`,
        actionTable: `tpop`,
        idTable: `ap`,
      }}
    >
      {`Teil-Populationen in Karte ${store.map.layer.tpop.visible ? `ausblenden` : `zeigen`}`}
    </MenuItem>
  </ContextMenu>

Pop.propTypes = {
  onClick: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  changeId: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
}

export default enhance(Pop)
