// @flow
import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const Apart = ({ onClick, tree }: { onClick: () => void, tree: Object }) => {
  const { user } = useContext(mobxStoreContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}apart`}>
        <div className="react-contextmenu-title">Aktionsplan-Art</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'apart',
              }}
            >
              erstelle neue
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                table: 'apart',
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

export default observer(Apart)
