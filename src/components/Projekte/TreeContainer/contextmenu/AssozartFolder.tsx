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
const insertData = {
  action: 'insert',
  table: 'assozart',
}

export const AssozartFolder = observer(({ onClick }) => {
  const { user } = useContext(MobxContext)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeAssozartFolder"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">assoziierte Art</div>
        {!userIsReadOnly(user.token) && (
          <MenuItem
            onClick={onClick}
            data={insertData}
          >
            erstelle neue
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
})
