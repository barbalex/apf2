import React, { useContext, useState, useCallback } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import isMobilePhone from '../../../../../modules/isMobilePhone'
import logout from '../../../../../modules/logout'
import EkfUser from './EkfUser'
import storeContext from '../../../../../storeContext'
import idbContext from '../../../../../idbContext'
import useSearchParamsState from '../../../../../modules/useSearchParamsState'

const Container = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`
const MehrButton = styled(Button)`
  color: white !important;
  text-transform: none !important;
`
const Version = styled.div`
  padding: 12px 16px;
  color: rgba(0, 0, 0, 0.54);
  user-select: none;
`

const AppbarMore = ({ onClickExporte: passedOnClickExporte, role }) => {
  const { projId } = useParams()

  const store = useContext(storeContext)
  const { deletedDatasets, user, setShowDeletions } = store
  const { idb } = useContext(idbContext)

  const [anchorEl, setAnchorEl] = useState(null)
  const closeMenu = useCallback(() => setAnchorEl(null), [])
  /**
   * need to clone projekteTabs
   * because otherwise removing elements errors out (because elements are sealed)
   */

  const isMobile = isMobilePhone()
  const [projekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobile ? ['tree'] : ['tree', 'daten'],
  )
  const exporteIsActive = !!projId

  const showDeletedDatasets = useCallback(() => {
    closeMenu()
    // prevent following from happening
    // before setAnchor has finished
    setTimeout(() => setShowDeletions(true))
  }, [closeMenu, setShowDeletions])
  const onClickMehrButton = useCallback(
    (event) => setAnchorEl(event.currentTarget),
    [],
  )
  const onClickExporte = useCallback(() => {
    closeMenu()
    // prevent following from happening
    // before setAnchor has finished
    setTimeout(() => passedOnClickExporte())
  }, [closeMenu, passedOnClickExporte])
  const onClickLogout = useCallback(() => {
    logout(idb)
  }, [idb])

  const onClickUptime = useCallback(() => {
    window.open('https://uptime.apflora.ch')
    setAnchorEl(null)
  }, [])

  return (
    <Container>
      <MehrButton
        aria-label="Mehr"
        aria-owns={anchorEl ? 'appbar-more-menu' : null}
        aria-haspopup="true"
        onClick={onClickMehrButton}
        data-id="appbar-more"
      >
        Mehr
      </MehrButton>
      <Menu
        id="appbar-more-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
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
        {['apflora_manager', 'apflora_ap_writer'].includes(role) && (
          <EkfUser closeMenu={closeMenu} />
        )}
        <MenuItem
          onClick={onClickLogout}
          data-id="appbar-more-logout"
        >{`${user.name} abmelden (und Cache leeren)`}</MenuItem>
        <MenuItem onClick={onClickUptime}>
          Verfügbarkeit der Server von apflora.ch
        </MenuItem>
        <Version>Version: 1.81.4 vom 7.02.2023</Version>
      </Menu>
    </Container>
  )
}

export default observer(AppbarMore)
