// @flow
import React, { useContext, useState, useCallback } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const enhance = compose(observer)

const Tpopfreiwkontr = ({
  tree,
  onClick,
  token,
}: {
  tree: Object,
  onClick: () => void,
  token: String,
}) => {
  const { copying } = useContext(mobxStoreContext)

  // eslint-disable-next-line no-unused-vars
  const [label, changeLabel] = useState('')

  // according to https://github.com/vkbansal/react-contextmenu/issues/65
  // this is how to pass data from ContextMenuTrigger to ContextMenu
  const onShow = useCallback(event => changeLabel(event.detail.data.nodeLabel))

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${tree.name}tpopfreiwkontr`}
        collect={props => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Freiwilligen-Kontrolle</div>
        {!userIsReadOnly(token, 'freiw') && (
          <>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'tpopfreiwkontr',
              }}
            >
              erstelle neue
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                table: 'tpopfreiwkontr',
              }}
            >
              lösche
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'markForMoving',
                table: 'tpopfreiwkontr',
              }}
            >
              verschiebe
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'markForCopying',
                table: 'tpopfreiwkontr',
              }}
            >
              kopiere
            </MenuItem>
            {copying.table && (
              <MenuItem
                onClick={onClick}
                data={{
                  action: 'resetCopying',
                }}
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

export default enhance(Tpopfreiwkontr)
