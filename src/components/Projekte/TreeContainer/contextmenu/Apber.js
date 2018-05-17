// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const Apber = ({
  onClick,
  tree,
  token
}: {
  onClick: () => void,
  tree: Object,
  token: String
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}apber`}>
      <div className="react-contextmenu-title">AP-Bericht</div>
      {
        !userIsReadOnly(token) &&
        <Fragment>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'insert',
              table: 'apber',
            }}
          >
            erstelle neuen
          </MenuItem>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'delete',
              table: 'apber',
            }}
          >
            lösche
          </MenuItem>
        </Fragment>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default Apber
