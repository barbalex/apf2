// @flow
import React, { useContext, useState, useCallback } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import isMobilePhone from '../../../modules/isMobilePhone'
import logout from '../../../modules/logout'
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

const MyAppBar = ({
  onClickExporte: passedOnClickExporte,
  setShowDeletions,
  role,
}: {
  onClickExporte: () => void,
  setShowDeletions: () => void,
  role: string,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { deletedDatasets, user, urlQuery, treeActiveNodes } = mobxStore
  const { idb } = useContext(idbContext)

  const [anchorEl, setAnchorEl] = useState(null)
  /**
   * need to clone projekteTabs
   * because otherwise removing elements errors out (because elements are sealed)
   */
  const projekteTabs = { ...urlQuery }
  const exporteIsActive = !!treeActiveNodes.projekt
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
    // prevent following from happening
    // before setAnchor has finished
    setTimeout(() => setShowDeletions(true))
  })
  const onClickMehrButton = useCallback(event =>
    setAnchorEl(event.currentTarget),
  )
  const onClose = useCallback(() => setAnchorEl(null))
  const onClickExporte = useCallback(() => {
    setAnchorEl(null)
    // prevent following from happening
    // before setAnchor has finished
    setTimeout(() => passedOnClickExporte())
  })
  const onClickLogout = useCallback(() => {
    setAnchorEl(null)
    // prevent following from happening
    // before setAnchor has finished
    setTimeout(() => logout(idb))
  })

  return (
    <Container>
      <MehrButton
        aria-label="Mehr"
        aria-owns={anchorEl ? 'long-menu' : null}
        aria-haspopup="true"
        onClick={onClickMehrButton}
        className="appbar-more"
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
        <MenuItem onClick={onClickLogout} className="appbar-more-logout">{`${
          user.name
        } abmelden`}</MenuItem>
        <Version>Version: 1.3.2 vom 20.01.2019</Version>
      </Menu>
    </Container>
  )
}

export default observer(MyAppBar)
