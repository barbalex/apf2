import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.js'
import { StoreContext } from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopfreiwkontrzaehl',
}
const deleteData = {
  action: 'delete',
  table: 'tpopfreiwkontrzaehl',
}

const Tpopfreiwkontrzaehl = ({ onClick }) => {
  const { user } = useContext(StoreContext)

  return (
    <ErrorBoundary>
      <ContextMenu id="treeTpopfreiwkontrzaehl" hideOnLeave={true}>
        <div className="react-contextmenu-title">Zählung</div>
        {!userIsReadOnly(user.token, 'freiw') && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neue
            </MenuItem>
            <MenuItem onClick={onClick} data={deleteData}>
              lösche
            </MenuItem>
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(Tpopfreiwkontrzaehl)
