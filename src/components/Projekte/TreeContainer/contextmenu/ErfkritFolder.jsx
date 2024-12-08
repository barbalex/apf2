import { memo, useContext, useState, useCallback } from 'react'
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
  table: 'erfkrit',
}

export const ErfkritFolder = memo(
  observer(({ onClick }) => {
    const store = useContext(MobxContext)
    const {
      user,
      openChooseApToCopyErfkritsFrom,
      setOpenChooseApToCopyErfkritsFrom,
    } = store
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    // i.e. to know what node was clicked
    const [apId, changeApId] = useState(0)
    const onShow = useCallback(
      (event) => changeApId(event.detail.data.tableId),
      [],
    )

    const onOpenChooseApDialog = useCallback(
      () => setOpenChooseApToCopyErfkritsFrom(true),
      [],
    )

    return (
      <ErrorBoundary>
        <ContextMenu
          id="treeErfkritFolder"
          collect={(props) => props}
          onShow={onShow}
          hideOnLeave={true}
        >
          <div className="react-contextmenu-title">AP-Erfolgskriterien</div>
          {!userIsReadOnly(user.token) && (
            <>
              <MenuItem
                onClick={onClick}
                data={insertData}
              >
                erstelle neues
              </MenuItem>
              <MenuItem onClick={onOpenChooseApDialog}>
                aus anderer Art kopieren
              </MenuItem>
            </>
          )}
        </ContextMenu>
      </ErrorBoundary>
    )
  }),
)
