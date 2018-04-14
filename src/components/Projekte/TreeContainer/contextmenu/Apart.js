// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const Apart = ({ onClick, tree }: { onClick: () => void, tree: Object }) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}apart`}>
      <div className="react-contextmenu-title">Aktionsplan-Art</div>
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
    </ContextMenu>
  </ErrorBoundary>
)

export default Apart
