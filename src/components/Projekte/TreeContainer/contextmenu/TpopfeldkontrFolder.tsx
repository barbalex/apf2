import { useAtomValue } from 'jotai'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import {
  userTokenAtom,
  copyingAtom,
  movingAtom,
} from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

// create objects outside render
const openLowerNodesData = {
  action: 'openLowerNodes',
}
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'tpopfeldkontr',
}
const moveData = {
  action: 'move',
}
const copyData = {
  action: 'copy',
}
const resetCopyingData = {
  action: 'resetCopying',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const TpopfeldkontrFolder = ({ onClick }: Props) => {
  const moving = useAtomValue(movingAtom)
  const copying = useAtomValue(copyingAtom)
  const userToken = useAtomValue(userTokenAtom)

  const isMoving = moving.table && moving.table === 'tpopfeldkontr'
  const isCopying = copying.table && copying.table === 'tpopfeldkontr'

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeTpopfeldkontrFolder"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Feld-Kontrollen</div>
        <MenuItem
          onClick={onClick}
          data={openLowerNodesData}
        >
          alle öffnen
        </MenuItem>
        <MenuItem
          onClick={onClick}
          data={closeLowerNodesData}
        >
          alle schliessen
        </MenuItem>
        {!userIsReadOnly(userToken) && (
          <>
            <MenuItem
              onClick={onClick}
              data={insertData}
            >
              erstelle neue
            </MenuItem>
            {isMoving && (
              <MenuItem
                onClick={onClick}
                data={moveData}
              >
                {`verschiebe '${moving.label}' hierhin`}
              </MenuItem>
            )}
            {isCopying && (
              <MenuItem
                onClick={onClick}
                data={copyData}
              >
                {`kopiere '${copying.label}' hierhin`}
              </MenuItem>
            )}
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
}
