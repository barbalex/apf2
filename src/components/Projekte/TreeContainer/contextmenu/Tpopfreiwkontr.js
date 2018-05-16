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

const Tpopfreiwkontr = ({
  store,
  tree,
  onClick,
  changeLabel,
  label,
  onShow,
}: {
  store: Object,
  tree: Object,
  onClick: () => void,
  changeLabel: () => void,
  label: string | number,
  onShow: () => void,
}) => (
  <ErrorBoundary>
    <ContextMenu
      id={`${tree.name}tpopfreiwkontr`}
      collect={props => props}
      onShow={onShow}
    >
      <div className="react-contextmenu-title">Freiwilligen-Kontrolle</div>
      {
        !store.user.readOnly &&
        <Fragment>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'insert',
              table: 'tpopfreiwkontr',
            }}
          >
            erstelle neue
          </MenuItem>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'delete',
              table: 'tpopfreiwkontr',
            }}
          >
            lösche
          </MenuItem>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'markForMoving',
              table: 'tpopfreiwkontr',
            }}
          >
            verschiebe
          </MenuItem>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'markForCopying',
              table: 'tpopfreiwkontr',
            }}
          >
            kopiere
          </MenuItem>
          {store.copying.table && (
            <MenuItem
              onClick={onClick}
              data={{
                action: 'resetCopying',
              }}
            >
              Kopieren aufheben
            </MenuItem>
          )}
        </Fragment>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(Tpopfreiwkontr)
