import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.js'
import { MobxContext } from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'user',
}
const deleteData = {
  action: 'delete',
  table: 'user',
}

export const User = memo(
  observer(({ onClick }) => {
    const { user } = useContext(MobxContext)

    const mayWrite = !userIsReadOnly(user.token)

    return (
      <ErrorBoundary>
        <ContextMenu
          id="treeUser"
          hideOnLeave={true}
        >
          <div className="react-contextmenu-title">Benutzer</div>
          {mayWrite && (
            <>
              <MenuItem
                onClick={onClick}
                data={insertData}
              >
                erstelle neuen
              </MenuItem>
              <MenuItem
                onClick={onClick}
                data={deleteData}
              >
                lösche
              </MenuItem>
            </>
          )}
        </ContextMenu>
      </ErrorBoundary>
    )
  }),
)
