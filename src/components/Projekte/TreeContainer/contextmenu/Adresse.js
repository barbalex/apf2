// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const Adresse = ({
  onClick,
  treeName,
}: {
  onClick: () => void,
  treeName: string,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${treeName}adresse`}>
      <div className="react-contextmenu-title">Adresse</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'adresse',
        }}
      >
        erstelle neue
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'delete',
          table: 'adresse',
        }}
      >
        lösche
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default Adresse
