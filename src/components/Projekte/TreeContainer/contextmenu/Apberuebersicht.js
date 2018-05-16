// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const enhance = compose(inject('store'), observer)

const Apberuebersicht = ({
  onClick,
  tree,
  store
}: {
  onClick: () => void,
  tree: Object,
  store: Object
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}apberuebersicht`}>
      <div className="react-contextmenu-title">AP-Bericht</div>
      {
        !store.user.readOnly &&
        <Fragment>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'insert',
              table: 'apberuebersicht',
            }}
          >
            erstelle neuen
          </MenuItem>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'delete',
              table: 'apberuebersicht',
            }}
          >
            lösche
          </MenuItem>
        </Fragment>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(Apberuebersicht)
