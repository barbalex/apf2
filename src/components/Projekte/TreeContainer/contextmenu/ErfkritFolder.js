// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const ErfkritFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}erfkritFolder`}>
      <div className="react-contextmenu-title">AP-Erfolgskriterien</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'erfkrit',
        }}
      >
        erstelle neues
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default ErfkritFolder
