// @flow
import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const Apfolder = ({ onClick, tree }: { onClick: () => void, tree: Object }) => {
  const { user } = useContext(mobxStoreContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}apFolder`}>
        <div className="react-contextmenu-title">Aktionsplan</div>
        <MenuItem
          onClick={onClick}
          data={{
            action: 'closeLowerNodes',
          }}
        >
          alle schliessen
        </MenuItem>
        {!userIsReadOnly(user.token) && (
          <MenuItem
            onClick={onClick}
            data={{
              action: 'insert',
              table: 'ap',
            }}
          >
            erstelle neuen
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(Apfolder)
