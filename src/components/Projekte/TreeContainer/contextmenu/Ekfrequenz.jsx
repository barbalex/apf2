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
  table: 'ekfrequenz',
}
const deleteData = {
  action: 'delete',
  table: 'ekfrequenz',
}

export const Ekfrequenz = memo(
  observer(({ onClick }) => {
    const { user } = useContext(MobxContext)

    return (
      <ErrorBoundary>
        <ContextMenu
          id="treeEkfrequenz"
          hideOnLeave={true}
        >
          <div className="react-contextmenu-title">EK-Frequenz</div>
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
