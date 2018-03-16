// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const TpopfreiwkontrzaehlFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}tpopfreiwkontrzaehlFolder`}>
      <div className="react-contextmenu-title">Zählungen</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'insert',
          table: 'tpopfreiwkontrzaehl',
        }}
      >
        erstelle neue
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default TpopfreiwkontrzaehlFolder
