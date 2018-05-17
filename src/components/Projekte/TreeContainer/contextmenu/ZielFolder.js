// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const ZielFolder = ({
  onClick,
  tree,
  token
}: {
  onClick: () => void,
  tree: Object,
  token: String
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}zieljahrFolder`}>
      <div className="react-contextmenu-title">Ziele</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'openLowerNodes',
        }}
      >
        alle öffnen
      </MenuItem>
      {
        !userIsReadOnly(token) &&
        <MenuItem
          onClick={onClick}
          data={{
            action: 'insert',
            table: 'ziel',
          }}
        >
          erstelle neues
        </MenuItem>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default ZielFolder
