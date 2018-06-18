// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const TpopfreiwkontrzaehlFolder = ({
  onClick,
  tree,
  token
}: {
  onClick: () => void,
  tree: Object,
  token: String
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}tpopfreiwkontrzaehlFolder`}>
      <div className="react-contextmenu-title">Zählungen</div>
      {
        !userIsReadOnly(token, 'freiw') &&
        <MenuItem
          onClick={onClick}
          data={{
            action: 'insert',
            table: 'tpopfreiwkontrzaehl',
          }}
        >
          erstelle neue
        </MenuItem>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default TpopfreiwkontrzaehlFolder
