// @flow
import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const TpopfeldkontrzaehlFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => {
  const { user } = useContext(mobxStoreContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}tpopfeldkontrzaehlFolder`}>
        <div className="react-contextmenu-title">Zählungen</div>
        {!userIsReadOnly(user.token) && (
          <MenuItem
            onClick={onClick}
            data={{
              action: 'insert',
              table: 'tpopfeldkontrzaehl',
            }}
          >
            erstelle neue
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(TpopfeldkontrzaehlFolder)
