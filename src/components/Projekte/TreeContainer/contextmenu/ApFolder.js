// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const Apfolder = ({ onClick, tree }: { onClick: () => void, tree: Object }) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}apFolder`}>
      <div className="react-contextmenu-title">Art</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'ap',
        }}
      >
        erstelle neue
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'openLowerNodes',
        }}
      >
        alle öffnen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default Apfolder
