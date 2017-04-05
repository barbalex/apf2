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
  { onClick, store, treeName, changeLabel, label, onShow }:
  {onClick:()=>void,store:Object,treeName:string,changeLabel:()=>{},label:string|number,onShow:()=>void}
) => {
  const moving = store.moving.table && store.moving.table === `pop`

  return (
    <ContextMenu
      id={`${treeName}popFolder`}
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
    </ContextMenu>
  )
}

PopFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
  changeLabel: PropTypes.func.isRequired,
  label: PropTypes.any.isRequired,
  onShow: PropTypes.func.isRequired,
}

export default enhance(PopFolder)
