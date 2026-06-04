import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import {
  userTokenAtom,
  setOpenChooseApToCopyErfkritsFromAtom,
} from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'erfkrit',
}

export const ErfkritFolder = ({ onClick }) => {
  const userToken = useAtomValue(userTokenAtom)
  const setOpenChooseApToCopyErfkritsFrom = useSetAtom(
    setOpenChooseApToCopyErfkritsFromAtom,
  )
  // according to https://github.com/vkbansal/react-contextmenu/issues/65
  // this is how to pass data from ContextMenuTrigger to ContextMenu
  // i.e. to know what node was clicked
  const [apId, changeApId] = useState(0)
  const onShow = (event) => changeApId(event.detail.data.tableId)
  const onOpenChooseApDialog = () => setOpenChooseApToCopyErfkritsFrom(true)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeErfkritFolder"
        collect={(props) => props}
        onShow={onShow}
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">AP-Erfolgskriterien</div>
        {!userIsReadOnly(userToken) && (
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
}
