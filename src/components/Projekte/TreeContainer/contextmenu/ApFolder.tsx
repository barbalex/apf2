import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import { MobxContext } from '../../../../mobxContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

// create objects outside render
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'ap',
}

export const Apfolder = observer(({ onClick }) => {
  const { user } = useContext(MobxContext)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeApFolder"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Art</div>
        <MenuItem
          onClick={onClick}
          data={closeLowerNodesData}
        >
          alle schliessen
        </MenuItem>
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
})
