// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const AssozartFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}assozartFolder`}>
      <div className="react-contextmenu-title">assoziierte Art</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'assozart',
        }}
      >
        erstelle neue
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default AssozartFolder
