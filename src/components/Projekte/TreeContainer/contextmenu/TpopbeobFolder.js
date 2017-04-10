// @flow
import React from 'react'
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
    onShow: props => (event) => {
      props.changeId(event.detail.data.nodeId)
    },
  }),
  observer
)

const TpopbeobFolder = (
  {
    store,
    tree,
    onClick,
    changeId,
    id,
    onShow,
  }:
  {
    store: Object,changeId: () => {},
    tree: Object,
    onClick: () => void,
    id: number,
    onShow: () => {},
  }
) =>
  <ContextMenu
    id={`${tree.name}tpopBeobFolder`}
    collect={props => props}
    onShow={onShow}
  >
    <div className="react-contextmenu-title">Beobachtungen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showBeobOnMap`,
        actionTable: `tpopBeob`,
        idTable: `ap`,
      }}
    >
      {`blende auf Karte ${store.map.activeApfloraLayers.includes(`TpopBeob`) ? `aus` : `ein`}`}
    </MenuItem>
  </ContextMenu>

export default enhance(TpopbeobFolder)
