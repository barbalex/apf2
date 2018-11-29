// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const Apfolder = ({
  onClick,
  treeName,
}: {
  onClick: () => void,
  treeName: string,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${treeName}adresseFolder`}>
      <div className="react-contextmenu-title">Adressen</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'closeLowerNodes',
        }}
      >
        alle schliessen
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'adresse',
        }}
      >
        erstelle neue
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default Apfolder
