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
  table: 'tpopber',
}

export const TpopberFolder = memo(
  observer(({ onClick }) => {
    const { user } = useContext(StoreContext)

    return (
      <ErrorBoundary>
        <ContextMenu
          id="treeTpopberFolder"
          hideOnLeave={true}
        >
          <div className="react-contextmenu-title">Kontroll-Berichte</div>
          {!userIsReadOnly(user.token) && (
            <MenuItem
              onClick={onClick}
              data={insertData}
            >
              erstelle neuen
            </MenuItem>
          )}
        </ContextMenu>
      </ErrorBoundary>
    )
  }),
)
