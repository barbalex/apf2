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

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'erfkrit',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const ErfkritFolder = ({ onClick }: Props) => {
  const userToken = useAtomValue(userTokenAtom)
  const setOpenChooseApToCopyErfkritsFrom = useSetAtom(
    setOpenChooseApToCopyErfkritsFromAtom,
  )
  // according to https://github.com/vkbansal/react-contextmenu/issues/65
  // this is how to pass data from ContextMenuTrigger to ContextMenu
  // i.e. to know what node was clicked
  const [, changeApId] = useState(0)
  const onShow = (event: { detail: { data?: Record<string, unknown> } }) =>
    changeApId(event.detail.data?.tableId as number)
  const onOpenChooseApDialog = () => setOpenChooseApToCopyErfkritsFrom(true)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeErfkritFolder"
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
