// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const enhance = compose(
  withState('label', 'changeLabel', ''),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => event => props.changeLabel(event.detail.data.nodeLabel),
  })
)

const Tpopmassnber = ({
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
  <ErrorBoundary>
    <ContextMenu
      id={`${tree.name}tpopmassnber`}
      collect={props => props}
      onShow={onShow}
    >
      <div className="react-contextmenu-title" style={{ width: '180px' }}>
        Massnahmen-Bericht
      </div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'tpopmassnber',
        }}
      >
        erstelle neuen
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'delete',
          table: 'tpopmassnber',
        }}
      >
        lösche
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(Tpopmassnber)
