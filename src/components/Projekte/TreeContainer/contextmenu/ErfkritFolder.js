// @flow
import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const ErfkritFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => {
  const { user } = useContext(mobxStoreContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}erfkritFolder`}>
        <div className="react-contextmenu-title">AP-Erfolgskriterien</div>
        {!userIsReadOnly(user.token) && (
          <MenuItem
            onClick={onClick}
            data={{
              action: 'insert',
              table: 'erfkrit',
            }}
          >
            erstelle neues
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(ErfkritFolder)
