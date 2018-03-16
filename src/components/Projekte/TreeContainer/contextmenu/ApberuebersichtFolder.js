// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const ApberuebersichtFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}apberuebersichtFolder`}>
      <div className="react-contextmenu-title">AP-Bericht</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'apberuebersicht',
        }}
      >
        erstelle neuen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default ApberuebersichtFolder
