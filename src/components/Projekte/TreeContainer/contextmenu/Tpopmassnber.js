// @flow
import React, { useContext, useState, useCallback } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const enhance = compose(observer)

const Tpopmassnber = ({
  treeName,
  onClick,
}: {
  treeName: string,
  onClick: () => void,
}) => {
  const { user } = useContext(mobxStoreContext)

  // eslint-disable-next-line no-unused-vars
  const [label, changeLabel] = useState('')

  // according to https://github.com/vkbansal/react-contextmenu/issues/65
  // this is how to pass data from ContextMenuTrigger to ContextMenu
  const onShow = useCallback(event => changeLabel(event.detail.data.nodeLabel))

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${treeName}tpopmassnber`}
        collect={props => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title" style={{ width: '180px' }}>
          Massnahmen-Bericht
        </div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'tpopmassnber',
              }}
            >
              erstelle neuen
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                table: 'tpopmassnber',
              }}
            >
              lösche
            </MenuItem>
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default enhance(Tpopmassnber)
