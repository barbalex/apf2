import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext.js'
import ErrorBoundary from '../../../shared/ErrorBoundary.jsx'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopber',
}

const TpopberFolder = ({ onClick }) => {
  const { user } = useContext(storeContext)

  return (
    <ErrorBoundary>
      <ContextMenu id="treeTpopberFolder" hideOnLeave={true}>
        <div className="react-contextmenu-title">Kontroll-Berichte</div>
        {!userIsReadOnly(user.token) && (
          <MenuItem onClick={onClick} data={insertData}>
            erstelle neuen
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(TpopberFolder)
