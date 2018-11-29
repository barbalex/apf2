// @flow
import React, { useContext, useState, useCallback } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const enhance = compose(observer)

const Tpopfreiwkontrzaehl = ({
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
        id={`${treeName}tpopfreiwkontrzaehl`}
        collect={props => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Zählung</div>
        {!userIsReadOnly(user.token, 'freiw') && (
          <>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'tpopfreiwkontrzaehl',
              }}
            >
              erstelle neue
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                table: 'tpopfreiwkontrzaehl',
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

export default enhance(Tpopfreiwkontrzaehl)
