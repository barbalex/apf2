import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.js'
import { StoreContext } from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopfeldkontrzaehl',
}

const TpopfeldkontrzaehlFolder = ({ onClick }) => {
  const { user } = useContext(StoreContext)

  return (
    <ErrorBoundary>
      <ContextMenu id="treeTpopfeldkontrzaehlFolder" hideOnLeave={true}>
        <div className="react-contextmenu-title">Zählungen</div>
        {!userIsReadOnly(user.token) && (
          <MenuItem onClick={onClick} data={insertData}>
            erstelle neue
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(TpopfeldkontrzaehlFolder)
