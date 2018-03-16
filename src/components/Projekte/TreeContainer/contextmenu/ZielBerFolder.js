// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const ZielBerFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}zielberFolder`}>
      <div className="react-contextmenu-title">Berichte</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'zielber',
        }}
      >
        erstelle neuen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default ZielBerFolder
