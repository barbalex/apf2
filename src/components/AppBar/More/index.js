// @flow
import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import clone from 'lodash/clone'

import isMobilePhone from '../../../modules/isMobilePhone'
import ErrorBoundary from '../../shared/ErrorBoundary'
import dataGql from '../localData'
import logout from '../../../modules/logout'
import getActiveNodes from '../../../modules/getActiveNodes'
import withDeleteState from '../../../state/withDeleteState'
import EkfAdresse from './EkfAdresse'

const Container = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`
const MehrButton = styled(Button)`
  color: white !important;
`
const Version = styled.div`
  padding: 12px 16px;
  color: rgba(0, 0, 0, 0.87);
  user-select: none;
`

const enhance = compose(
  withDeleteState,
  withState('anchorEl', 'setAnchorEl', null),
  withHandlers({
    openDocs: ({ setAnchorEl }) => () => {
      setAnchorEl(null)
      window.open('https://docs.apflora.ch')
    },
    watchVideos: ({ setAnchorEl }) => () => {
      setAnchorEl(null)
      window.open(
        'https://www.youtube.com/playlist?list=PLTz8Xt5SOQPS-dbvpJ_DrB4-o3k3yj09J',
      )
    },
    showDeletedDatasets: ({ setAnchorEl, setShowDeletions }) => () => {
      setAnchorEl(null)
      setShowDeletions(true)
    },
    onClickMehrButton: ({ setAnchorEl }) => event =>
      setAnchorEl(event.currentTarget),
    onClose: ({ setAnchorEl }) => () => setAnchorEl(null),
  }),
)

const MyAppBar = ({
  onClickButton,
  showDeletedDatasets,
  watchVideos,
  openDocs,
  anchorEl,
  setAnchorEl,
  setShowDeletions,
  role,
  deleteState,
  onClickMehrButton,
  onClose,
}: {
  onClickButton: () => void,
  showDeletedDatasets: () => void,
  watchVideos: () => void,
  openDocs: () => void,
  anchorEl: Object,
  setAnchorEl: () => void,
  setShowDeletions: () => void,
  role: String,
  deleteState: Object,
  onClickMehrButton: () => void,
  onClose: () => void,
}) => (
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
          <Container>
            <MehrButton
              aria-label="Mehr"
              aria-owns={anchorEl ? 'long-menu' : null}
              aria-haspopup="true"
              onClick={onClickMehrButton}
            >
              Mehr
            </MehrButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={onClose}
            >
              {isMobile && exporteIsActive && (
                <MenuItem
                  onClick={() => {
                    onClose()
                    onClickButton('exporte')
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
                role,
              ) && <EkfAdresse setAnchorEl={setAnchorEl} />}
              <MenuItem onClick={openDocs}>Dokumentation öffnen</MenuItem>
              <MenuItem onClick={watchVideos}>Video-Anleitungen</MenuItem>
              <MenuItem
                onClick={() => {
                  onClose()
                  logout()
                }}
              >
                {`${get(data, 'user.name')} abmelden`}
              </MenuItem>
              <Version>Version: 1.3.0 vom 25.9.2018</Version>
            </Menu>
          </Container>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default enhance(MyAppBar)
