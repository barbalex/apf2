import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopfreiwkontr',
}
const deleteData = {
  action: 'delete',
  table: 'tpopfreiwkontr',
}
const markForMovingData = {
  action: 'markForMoving',
  table: 'tpopfreiwkontr',
}
const markForCopyingData = {
  action: 'markForCopying',
  table: 'tpopfreiwkontr',
}
const resetCopyingData = {
  action: 'resetCopying',
}

export const Tpopfreiwkontr = observer(({ onClick }) => {
  const { copying, user } = useContext(MobxContext)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeTpopfreiwkontr"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Freiwilligen-Kontrolle</div>
        {!userIsReadOnly(user.token, 'freiw') && (
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
