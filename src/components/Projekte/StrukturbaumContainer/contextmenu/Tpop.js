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
  withState(`label`, `changeLabel`, ``),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => (event) => {
      props.changeId(event.detail.data.nodeId)
      props.changeLabel(event.detail.data.nodeLabel)
    },
  }),
  observer
)

const Tpop = (
  { onClick, store, changeId, id, changeLabel, label, onShow }:
  {onClick:() => void,store:Object,changeId:()=>{},id:number,changeLabel:()=>{},label:string,onShow:()=>{}}
) =>
  <ContextMenu
    id="tpop"
    collect={props => props}
    onShow={onShow}
  >
    <div className="react-contextmenu-title">Teil-Population</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpop`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        actionTable: `tpop`,
        idTable: `tpop`,
      }}
    >
      {`"${label}" löschen`}
    </MenuItem>
    <div className="react-contextmenu-divider" />
    <div className="react-contextmenu-title">Karte</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showOnMap`,
        actionTable: `tpop`,
        idTable: `ap`,
      }}
    >
      {`Teil-Populationen ${store.map.tpop.visible ? `ausblenden` : `zeigen`}`}
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `highlightOnMap`,
        actionTable: `tpop`,
        idTable: `tpop`,
      }}
    >
      {
        store.map.tpop.highlightedIds.includes(id) ?
        `Hervorhebung von "${label}" aufheben` :
        `"${label}" hervorheben`
      }
    </MenuItem>
  </ContextMenu>

Tpop.propTypes = {
  onClick: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  changeId: PropTypes.func.isRequired,
  changeLabel: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
}

export default enhance(Tpop)
