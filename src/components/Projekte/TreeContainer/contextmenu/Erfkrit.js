// @flow
import React, { useContext, useState, useCallback } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const enhance = compose(observer)

const Erfkrit = ({
  tree,
  onClick,
  token,
}: {
  tree: Object,
  onClick: () => void,
  token: String,
}) => {
  const { user } = useContext(mobxStoreContext)
  // eslint-disable-next-line no-unused-vars
  const [label, changeLabel] = useState('')
  const onShow = useCallback(event => changeLabel(event.detail.data.nodeLabel))

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${tree.name}erfkrit`}
        collect={props => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">AP-Erfolgskriterium</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'erfkrit',
              }}
            >
              erstelle neues
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                table: 'erfkrit',
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

export default enhance(Erfkrit)
