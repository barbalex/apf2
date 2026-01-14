import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import { MobxContext } from '../../../../mobxContext.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopmassn',
}
const deleteData = {
  action: 'delete',
  table: 'tpopmassn',
}
const markForMovingData = {
  action: 'markForMoving',
  table: 'tpopmassn',
}
const markForCopyingData = {
  action: 'markForCopying',
  table: 'tpopmassn',
}
const resetCopyingData = {
  action: 'resetCopying',
}

export const Tpopmassn = observer(({ onClick }) => {
  const { copying, user } = useContext(MobxContext)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeTpopmassn"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Massnahme</div>
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
            <MenuItem
              onClick={onClick}
              data={markForMovingData}
            >
              verschiebe
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={markForCopyingData}
            >
              kopiere
            </MenuItem>
            {copying.table && (
              <MenuItem
                onClick={onClick}
                data={resetCopyingData}
              >
                Kopieren aufheben
              </MenuItem>
            )}
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
})
