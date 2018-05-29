// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

// TODO: add MenuItem for admins to add new projekt
const Projekt = ({ onClick, tree }: { onClick: () => void, tree: Object }) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}projekt`}>
      <div className="react-contextmenu-title">Projekt</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'closeLowerNodes',
        }}
      >
        alle schliessen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default Projekt
