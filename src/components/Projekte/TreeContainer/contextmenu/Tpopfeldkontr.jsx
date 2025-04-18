import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopfeldkontr',
}
const deleteData = {
  action: 'delete',
  table: 'tpopfeldkontr',
}
const markForMovingData = {
  action: 'markForMoving',
  table: 'tpopfeldkontr',
}
const markForCopyingData = {
  action: 'markForCopying',
  table: 'tpopfeldkontr',
}
const resetCopyingData = {
  action: 'resetCopying',
}
const markForCopyingBiotopData = {
  action: 'markForCopyingBiotop',
  table: 'tpopfeldkontr',
}
const copyBiotopData = {
  action: 'copyBiotop',
}
const resetCopyingBiotopData = {
  action: 'resetCopyingBiotop',
}

export const Tpopfeldkontr = memo(
  observer(({ onClick }) => {
    const { copying, user, copyingBiotop } = useContext(MobxContext)

    return (
      <ErrorBoundary>
        <ContextMenu
          id="treeTpopfeldkontr"
          hideOnLeave={true}
        >
          <div className="react-contextmenu-title">Feld-Kontrolle</div>
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
              <MenuItem
                onClick={onClick}
                data={markForCopyingBiotopData}
              >
                kopiere Biotop
              </MenuItem>
              {copyingBiotop.label && (
                <>
                  <MenuItem
                    onClick={onClick}
                    data={copyBiotopData}
                  >
                    {`kopiere Biotop von '${copyingBiotop.label}' hierhin`}
                  </MenuItem>
                  <MenuItem
                    onClick={onClick}
                    data={resetCopyingBiotopData}
                  >
                    Biotop Kopieren aufheben
                  </MenuItem>
                </>
              )}
            </>
          )}
        </ContextMenu>
      </ErrorBoundary>
    )
  }),
)
