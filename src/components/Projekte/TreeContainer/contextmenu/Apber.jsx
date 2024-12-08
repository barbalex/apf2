import { useContext } from 'react'

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
  table: 'apber',
}
const deleteData = {
  action: 'delete',
  table: 'apber',
}

export const Apber = ({ onClick }) => {
  const { user } = useContext(MobxContext)
  const isReadOnly = userIsReadOnly(user.token)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeApber"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">AP-Bericht</div>
        {!isReadOnly && (
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
}
