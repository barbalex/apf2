// @flow
import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const User = ({
  onClick,
  tree,
  token,
}: {
  onClick: () => void,
  tree: Object,
  token: String,
}) => {
  const { user } = useContext(mobxStoreContext)

  const mayWrite = !userIsReadOnly(user.token)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}user`}>
        <div className="react-contextmenu-title">Benutzer</div>
        {mayWrite && (
          <>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'user',
              }}
            >
              erstelle neuen
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                table: 'user',
              }}
            >
              lösche
            </MenuItem>
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(User)
