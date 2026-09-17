import { useAtomValue } from 'jotai'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import { userTokenAtom, copyingAtom } from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

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

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const Tpopfreiwkontr = ({ onClick }: Props) => {
  const copying = useAtomValue(copyingAtom)
  const userToken = useAtomValue(userTokenAtom)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeTpopfreiwkontr"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Freiwilligen-Kontrolle</div>
        {!userIsReadOnly(userToken, 'freiw' as unknown as boolean) && (
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
}
