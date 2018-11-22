// @flow
import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const ApberFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => {
  const { user } = useContext(mobxStoreContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}apberFolder`}>
        <div className="react-contextmenu-title">AP-Bericht</div>
        {!userIsReadOnly(user.token) && (
          <MenuItem
            onClick={onClick}
            data={{
              action: 'insert',
              table: 'apber',
            }}
          >
            erstelle neuen
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(ApberFolder)
