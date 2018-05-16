// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const enhance = compose(
  inject('store'),
  withState('label', 'changeLabel', ''),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => event => props.changeLabel(event.detail.data.nodeLabel),
  })
)

const BerFolder = ({
  tree,
  store,
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
  store: Object
}) => (
  <ErrorBoundary>
    <ContextMenu
      id={`${tree.name}ber`}
      collect={props => props}
      onShow={onShow}
    >
      <div className="react-contextmenu-title">Bericht</div>
      {
        !store.user.readOnly &&
        <Fragment>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'insert',
              table: 'ber',
            }}
          >
            erstelle neuen
          </MenuItem>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'delete',
              table: 'ber',
            }}
          >
            lösche
          </MenuItem>
        </Fragment>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(BerFolder)
