// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const TpopmassnberFolder = ({
  onClick,
  tree,
  token
}: {
  onClick: () => void,
  tree: Object,
  token: String
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}tpopmassnberFolder`}>
      <div className="react-contextmenu-title">Massnahmen-Berichte</div>
      {
        !userIsReadOnly(token) &&
        <MenuItem
          onClick={onClick}
          data={{
            action: 'insert',
            table: 'tpopmassnber',
          }}
        >
          erstelle neuen
        </MenuItem>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default TpopmassnberFolder
