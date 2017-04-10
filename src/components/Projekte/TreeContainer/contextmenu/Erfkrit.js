// @flow
import React from 'react'
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

const Erfkrit = (
  {
    tree,
    onClick,
    changeLabel,
    label,
    onShow,
  }:
  {
    tree: Object,
    onClick: () => void,
    changeLabel: () => void,
    label: string|number,
    onShow: () => void,
  }
) =>
  <ContextMenu
    id={`${tree.name}erfkrit`}
    collect={props => props}
    onShow={onShow}
  >
    <div className="react-contextmenu-title">AP-Erfolgskriterium</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `erfkrit`,
      }}
    >
      erstelle neues
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `erfkrit`,
      }}
    >
      lösche
    </MenuItem>
  </ContextMenu>

export default enhance(Erfkrit)
