import { useAtomValue } from 'jotai'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import { userTokenAtom } from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopmassnber',
}

export const TpopmassnberFolder = ({ onClick }) => {
  const userToken = useAtomValue(userTokenAtom)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeTpopmassnberFolder"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Massnahmen-Berichte</div>
        {!userIsReadOnly(userToken) && (
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
}
