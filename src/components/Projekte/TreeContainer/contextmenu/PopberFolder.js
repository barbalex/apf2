// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const PopberFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}popberFolder`}>
      <div className="react-contextmenu-title">Kontroll-Berichte</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'popber',
        }}
      >
        erstelle neuen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default PopberFolder
