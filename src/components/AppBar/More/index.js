// @flow
import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import clone from 'lodash/clone'
import { Subscribe } from 'unstated'

import isMobilePhone from '../../../modules/isMobilePhone'
import ErrorBoundary from '../../shared/ErrorBoundary'
import dataGql from '../data.graphql'
import logout from '../../../modules/logout'
import getActiveNodes from '../../../modules/getActiveNodes'
import DeleteState from '../../../state/Delete'

const MehrButton = styled(Button)`
  color: white !important;
`
const Version = styled.div`
  padding: 12px 16px;
  color: rgba(0, 0, 0, 0.87);
  user-select: none;
`

const enhance = compose(
  withHandlers({
    watchVideos: ({ setAnchorEl }) => () => {
      setAnchorEl(null)
      window.open(
        'https://www.youtube.com/playlist?list=PLTz8Xt5SOQPS-dbvpJ_DrB4-o3k3yj09J'
      )
    },
    showDeletedDatasets: ({ setAnchorEl, setShowDeletions }) => () => {
      setAnchorEl(null)
      setShowDeletions(true)
    },
  })
)

const MyAppBar = ({
  onClickButton,
  showDeletedDatasets,
  watchVideos,
  anchorEl,
  setAnchorEl,
  setShowDeletions,
  role,
}: {
  onClickButton: () => void,
  showDeletedDatasets: () => void,
  watchVideos: () => void,
  anchorEl: Object,
  setAnchorEl: () => void,
  setShowDeletions: () => void,
  role: String,
}) => (
  <Subscribe to={[DeleteState]}>
    {deleteState => (
      <Query query={dataGql}>
        {({ loading, error, data, client }) => {
          if (error) return `Fehler: ${error.message}`
          const activeNodeArray = get(data, 'tree.activeNodeArray')
          const activeNodes = getActiveNodes(activeNodeArray)
          /**
           * need to clone projekteTabs
           * because otherwise removing elements errors out (because elements are sealed)
           */
          const projekteTabs = clone(get(data, 'urlQuery.projekteTabs', []))
          const exporteIsActive = !!activeNodes.projekt
          const isMobile = isMobilePhone()
          const datasetsDeleted = deleteState.state.datasets

          return (
            <ErrorBoundary>
              <div>
                <MehrButton
                  aria-label="Mehr"
                  aria-owns={anchorEl ? 'long-menu' : null}
                  aria-haspopup="true"
                  onClick={event => setAnchorEl(event.currentTarget)}
                >
                  Mehr
                </MehrButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  {isMobile &&
                    exporteIsActive && (
                      <MenuItem
                        onClick={() => {
                          setAnchorEl(null)
                          onClickButton('exporte', client, projekteTabs)
                        }}
                        disabled={projekteTabs.includes('exporte')}
                      >
                        Exporte
                      </MenuItem>
                    )}
                  <MenuItem
                    onClick={showDeletedDatasets}
                    disabled={datasetsDeleted.length === 0}
                  >
                    gelöschte Datensätze wiederherstellen
                  </MenuItem>
                  {['apflora_manager', 'apflora_artverantwortlich'].includes(
                    role
                  ) && <MenuItem>EKF sehen als:</MenuItem>}
                  <MenuItem onClick={watchVideos}>Video-Anleitungen</MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null)
                      logout()
                    }}
                  >
                    {`${get(data, 'user.name')} abmelden`}
                  </MenuItem>
                  <Version>Version: 1.1.0 vom 8.7.2018</Version>
                </Menu>
              </div>
            </ErrorBoundary>
          )
        }}
      </Query>
    )}
  </Subscribe>
)

export default enhance(MyAppBar)
