// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const TpopmassnberFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}tpopmassnberFolder`}>
      <div className="react-contextmenu-title">Massnahmen-Berichte</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'tpopmassnber',
        }}
      >
        erstelle neuen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default TpopmassnberFolder
