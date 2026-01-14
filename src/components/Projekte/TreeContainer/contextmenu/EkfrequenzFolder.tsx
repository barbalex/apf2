import { useContext, useState } from 'react'
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
  table: 'ekfrequenz',
}

export const EkfrequenzFolder = observer(({ onClick }) => {
  const store = useContext(MobxContext)
  const { user, setOpenChooseApToCopyEkfrequenzsFrom } = store

  // according to https://github.com/vkbansal/react-contextmenu/issues/65
  // this is how to pass data from ContextMenuTrigger to ContextMenu
  // i.e. to know what node was clicked
  const [apId, changeApId] = useState(0)
  const onShow = (event) => changeApId(event.detail.data.tableId)
  const onOpenChooseApDialog = () => setOpenChooseApToCopyEkfrequenzsFrom(true)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeEkfrequenzFolder"
        collect={(props) => props}
        onShow={onShow}
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">EK-Frequenz</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem
              onClick={onClick}
              data={insertData}
            >
              erstelle neue
            </MenuItem>
            <MenuItem onClick={onOpenChooseApDialog}>
              aus anderer Art kopieren
            </MenuItem>
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
})
