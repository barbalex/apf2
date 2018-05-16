// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Query } from 'react-apollo'
import gql from "graphql-tag"
import get from 'lodash/get'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const enhance = compose(
  inject('store'),
  withState('label', 'changeLabel', ''),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => event => props.changeLabel(event.detail.data.nodeLabel),
  })
)

const Tpopfeldkontr = ({
  store,
  tree,
  onClick,
  changeLabel,
  label,
  onShow,
}: {
  store: Object,
  tree: Object,
  onClick: () => void,
  changeLabel: () => void,
  label: string | number,
  onShow: () => void,
}) => {

  return (
    <Query
      query={gql`
        query {
          copyingBiotop @client {
            id
            label
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (error) return `Fehler: ${error.message}`
        const copyingBiotop = get(data, 'copyingBiotop.id') !== "copyingBiotop"

        return (
          <ErrorBoundary>
            <ContextMenu
              id={`${tree.name}tpopfeldkontr`}
              collect={props => props}
              onShow={onShow}
            >
              <div className="react-contextmenu-title">Feld-Kontrolle</div>
              {
                !store.user.readOnly &&
                <Fragment>
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
                  {store.copying.table && (
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
                    <Fragment>
                      <MenuItem
                        onClick={onClick}
                        data={{
                          action: 'copyBiotop',
                        }}
                      >
                        {`kopiere Biotop von '${get(data, 'copyingBiotop.label')}' hierhin`}
                      </MenuItem>
                      <MenuItem
                        onClick={onClick}
                        data={{
                          action: 'resetCopyingBiotop',
                        }}
                      >
                        Biotop Kopieren aufheben
                      </MenuItem>
                    </Fragment>
                  )}
                </Fragment>
              }
            </ContextMenu>
          </ErrorBoundary>
        )
      }}
    </Query>
  )
}

export default enhance(Tpopfeldkontr)
