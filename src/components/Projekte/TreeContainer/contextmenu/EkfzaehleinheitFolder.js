// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const EkfzaehleinheitFolder = ({
  onClick,
  tree,
  token,
}: {
  onClick: () => void,
  tree: Object,
  token: String,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}ekfzaehleinheitFolder`}>
      <div className="react-contextmenu-title">EKF-Zähleinheit</div>
      {!userIsReadOnly(token) && (
        <MenuItem
          onClick={onClick}
          data={{
            action: 'insert',
            table: 'ekfzaehleinheit',
          }}
        >
          erstelle neue
        </MenuItem>
      )}
    </ContextMenu>
  </ErrorBoundary>
)

export default EkfzaehleinheitFolder
