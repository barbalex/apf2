// @flow
import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

// create objects outside render
const openLowerNodesData = {
  action: 'openLowerNodes',
}
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'ziel',
}

const ZielFolder = ({
  onClick,
  treeName,
}: {
  onClick: () => void,
  treeName: string,
}) => {
  const { user } = useContext(mobxStoreContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}zielFolder`}>
        <div className="react-contextmenu-title">Ziele</div>
        <MenuItem onClick={onClick} data={openLowerNodesData}>
          alle öffnen
        </MenuItem>
        <MenuItem onClick={onClick} data={closeLowerNodesData}>
          alle schliessen
        </MenuItem>
        {!userIsReadOnly(user.token) && (
          <MenuItem onClick={onClick} data={insertData}>
            erstelle neues
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(ZielFolder)
