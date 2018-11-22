// @flow
import React, { useContext, useCallback, useState } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import compose from 'recompose/compose'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../../modules/userIsReadOnly'
import withLocalData from './withLocalData'
import mobxStoreContext from '../../../../../mobxStoreContext'

const enhance = compose(
  withLocalData,
  observer,
)

const Tpopfeldkontr = ({
  tree,
  onClick,
  localData,
}: {
  tree: Object,
  onClick: () => void,
  localData: Object,
}) => {
  const { copying, user } = useContext(mobxStoreContext)

  // eslint-disable-next-line no-unused-vars
  const [label, changeLabel] = useState('')

  const copyingBiotop = get(localData, 'copyingBiotop.id') !== 'copyingBiotop'

  // according to https://github.com/vkbansal/react-contextmenu/issues/65
  // this is how to pass data from ContextMenuTrigger to ContextMenu
  const onShow = useCallback(event => changeLabel(event.detail.data.nodeLabel))

  if (localData.error) return `Fehler: ${localData.error.message}`
  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${tree.name}tpopfeldkontr`}
        collect={props => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Feld-Kontrolle</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'tpopfeldkontr',
              }}
            >
              erstelle neue
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                table: 'tpopfeldkontr',
              }}
            >
              lösche
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'markForMoving',
                table: 'tpopfeldkontr',
              }}
            >
              verschiebe
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'markForCopying',
                table: 'tpopfeldkontr',
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
            <MenuItem
              onClick={onClick}
              data={{
                action: 'markForCopyingBiotop',
                table: 'tpopfeldkontr',
              }}
            >
              kopiere Biotop
            </MenuItem>
            {copyingBiotop && (
              <>
                <MenuItem
                  onClick={onClick}
                  data={{
                    action: 'copyBiotop',
                  }}
                >
                  {`kopiere Biotop von '${get(
                    localData,
                    'copyingBiotop.label',
                  )}' hierhin`}
                </MenuItem>
                <MenuItem
                  onClick={onClick}
                  data={{
                    action: 'resetCopyingBiotop',
                  }}
                >
                  Biotop Kopieren aufheben
                </MenuItem>
              </>
            )}
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default enhance(Tpopfeldkontr)
