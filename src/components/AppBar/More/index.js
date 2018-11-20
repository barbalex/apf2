// @flow
import React, { useContext, useState, useCallback } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import compose from 'recompose/compose'
import get from 'lodash/get'
import clone from 'lodash/clone'
import { observer } from 'mobx-react-lite'

import isMobilePhone from '../../../modules/isMobilePhone'
import ErrorBoundary from '../../shared/ErrorBoundary'
import withLocalData from '../withLocalData'
import logout from '../../../modules/logout'
import getActiveNodes from '../../../modules/getActiveNodes'
import EkfAdresse from './EkfAdresse'
import mobxStoreContext from '../../../mobxStoreContext'
import idbContext from '../../../idbContext'

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
  withLocalData,
  observer,
)

const MyAppBar = ({
  onClickExporte: passedOnClickExporte,
  setShowDeletions,
  role,
  localData,
}: {
  onClickExporte: () => void,
  setShowDeletions: () => void,
  role: string,
  localData: () => void,
}) => {
  if (localData.error) return `Fehler: ${localData.error.message}`

  const { deletedDatasets } = useContext(mobxStoreContext)
  const { idb } = useContext(idbContext)

  const [anchorEl, setAnchorEl] = useState(null)

  const activeNodeArray = get(localData, 'tree.activeNodeArray')
  const activeNodes = getActiveNodes(activeNodeArray)
  /**
   * need to clone projekteTabs
   * because otherwise removing elements errors out (because elements are sealed)
   */
  const projekteTabs = clone(get(localData, 'urlQuery.projekteTabs', []))
  const exporteIsActive = !!activeNodes.projekt
  const isMobile = isMobilePhone()

  const openDocs = useCallback(() => {
    setAnchorEl(null)
    window.open('https://docs.apflora.ch')
  })
  const watchVideos = useCallback(() => {
    setAnchorEl(null)
    window.open(
      'https://www.youtube.com/playlist?list=PLTz8Xt5SOQPS-dbvpJ_DrB4-o3k3yj09J',
    )
  })
  const showDeletedDatasets = useCallback(() => {
    setAnchorEl(null)
    setShowDeletions(true)
  })
  const onClickMehrButton = useCallback(event =>
    setAnchorEl(event.currentTarget),
  )
  const onClose = useCallback(() => setAnchorEl(null))
  const onClickExporte = useCallback(() => {
    setAnchorEl(null)
    passedOnClickExporte()
  })
  const onClickLogout = useCallback(() => {
    setAnchorEl(null)
    logout(idb)
  })

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
              onClick={onClickExporte}
              disabled={projekteTabs.includes('exporte')}
            >
              Exporte
            </MenuItem>
          )}
          <MenuItem
            onClick={showDeletedDatasets}
            disabled={deletedDatasets.length === 0}
          >
            gelöschte Datensätze wiederherstellen
          </MenuItem>
          {['apflora_manager', 'apflora_artverantwortlich'].includes(role) && (
            <EkfAdresse setAnchorEl={setAnchorEl} />
          )}
          <MenuItem onClick={openDocs}>Dokumentation öffnen</MenuItem>
          <MenuItem onClick={watchVideos}>Video-Anleitungen</MenuItem>
          <MenuItem onClick={onClickLogout}>
            {`${get(localData, 'user.name')} abmelden`}
          </MenuItem>
          <Version>Version: 1.3.0 vom 25.9.2018</Version>
        </Menu>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(MyAppBar)
