import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.js'
import { StoreContext } from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'erfkrit',
}
const deleteData = {
  action: 'delete',
  table: 'erfkrit',
}

const Erfkrit = ({ onClick }) => {
  const { user } = useContext(StoreContext)

  return (
    <ErrorBoundary>
      <ContextMenu id="treeErfkrit" hideOnLeave={true}>
        <div className="react-contextmenu-title">AP-Erfolgskriterium</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neues
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

export default observer(Erfkrit)
