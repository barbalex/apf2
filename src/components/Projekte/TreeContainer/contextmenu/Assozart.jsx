import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.js'
import { StoreContext } from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'assozart',
}
const deleteData = {
  action: 'delete',
  table: 'assozart',
}

export const AssozartFolder = memo(
  observer(({ onClick }) => {
    const { user } = useContext(StoreContext)

    return (
      <ErrorBoundary>
        <ContextMenu
          id="treeAssozart"
          hideOnLeave={true}
        >
          <div className="react-contextmenu-title">assoziierte Art</div>
          {!userIsReadOnly(user.token) && (
            <>
              <MenuItem
                onClick={onClick}
                data={insertData}
              >
                erstelle neue
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
