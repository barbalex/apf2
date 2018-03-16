// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const PopmassnberFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}popmassnberFolder`}>
      <div className="react-contextmenu-title">Massnahmen-Berichte</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'popmassnber',
        }}
      >
        erstelle neuen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default PopmassnberFolder
