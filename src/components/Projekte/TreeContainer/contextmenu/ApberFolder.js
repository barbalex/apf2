// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const ApberFolder = ({
  onClick,
  tree,
  token
}: {
  onClick: () => void,
  tree: Object,
  token: String
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}apberFolder`}>
      <div className="react-contextmenu-title">AP-Bericht</div>
      {
        !userIsReadOnly(token) &&
        <MenuItem
          onClick={onClick}
          data={{
            action: 'insert',
            table: 'apber',
          }}
        >
          erstelle neuen
        </MenuItem>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default ApberFolder
