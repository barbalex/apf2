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

const Pop = (
  { onClick, store, treeName, changeId, id, changeLabel, label, onShow }:
  {onClick:()=>void,store:Object,treeName:string,changeId:()=>{},id:number,changeLabel:()=>{},label:string,onShow:()=>void}
) => {
  const moving = store.moving.table && store.moving.table === `tpop`
  const copying = store.copying.table && store.copying.table === `tpop`

  return (
    <ContextMenu
      id={`${treeName}pop`}
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
        erstelle neue
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={{
          action: `delete`,
          table: `pop`,
        }}
      >
        lösche
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={{
          action: `markForMoving`,
          table: `pop`,
        }}
      >
        verschiebe
      </MenuItem>
      {
        moving &&
        <MenuItem
          onClick={onClick}
          data={{
            action: `move`,
          }}
        >
          {`verschiebe '${store.moving.label}' hierhin`}
        </MenuItem>
      }
      <MenuItem
        onClick={onClick}
        data={{
          action: `markForCopying`,
          table: `pop`,
        }}
      >
        kopiere
      </MenuItem>
      {
        copying &&
        <MenuItem
          onClick={onClick}
          data={{
            action: `copy`,
          }}
        >
          {`kopiere '${store.copying.label}' hierhin`}
        </MenuItem>
      }
      {
        copying &&
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
  )
}

Pop.propTypes = {
  onClick: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  changeId: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  changeLabel: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  onShow: PropTypes.func.isRequired,
}

export default enhance(Pop)
