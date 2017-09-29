// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withState('label', 'changeLabel', ''),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => event => props.changeLabel(event.detail.data.nodeLabel),
  })
)

const Ziel = ({
  tree,
  onClick,
  changeLabel,
  label,
  onShow,
}: {
  tree: Object,
  onClick: () => void,
  changeLabel: () => void,
  label: string | number,
  onShow: () => void,
}) => (
  <ContextMenu id={`${tree.name}ziel`} collect={props => props} onShow={onShow}>
    <div className="react-contextmenu-title">Ziel</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'insert',
        table: 'ziel',
      }}
    >
      erstelle neues
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'delete',
        table: 'ziel',
      }}
    >
      lösche
    </MenuItem>
  </ContextMenu>
)

export default enhance(Ziel)
