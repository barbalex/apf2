// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const User = ({
  onClick,
  tree,
  token,
}: {
  onClick: () => void,
  tree: Object,
  token: String,
}) => {
  const mayWrite = !userIsReadOnly(token)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}user`}>
        <div className="react-contextmenu-title">Benutzer</div>
        {
          mayWrite &&
          <Fragment>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'user',
              }}
            >
              erstelle neuen
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                table: 'user',
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

export default User
