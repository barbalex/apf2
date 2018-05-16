// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const enhance = compose(inject('store'), observer)

const Apart = ({ onClick,
  tree,
  store
}: {
  onClick: () => void,
  tree: Object,
  store: Object
}) => {
  const mayWrite = !store.user.readOnly

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}apart`}>
        <div className="react-contextmenu-title">Aktionsplan-Art</div>
        {
          mayWrite &&
          <Fragment>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'apart',
              }}
            >
              erstelle neue
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                table: 'apart',
              }}
            >
              lösche
            </MenuItem>
          </Fragment>
        }
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default enhance(Apart)
