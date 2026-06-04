import { useAtomValue } from 'jotai'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import {
  userTokenAtom,
  copyingAtom,
  copyingBiotopAtom,
} from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

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

export const Tpopfeldkontr = ({ onClick }) => {
  const copying = useAtomValue(copyingAtom)
  const copyingBiotop = useAtomValue(copyingBiotopAtom)
  const userToken = useAtomValue(userTokenAtom)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeTpopfeldkontr"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Feld-Kontrolle</div>
        {!userIsReadOnly(userToken) && (
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
}
