// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const ApartFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}apArtFolder`}>
      <div className="react-contextmenu-title">AP-Arten</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'apart',
        }}
      >
        erstelle neue
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default ApartFolder
