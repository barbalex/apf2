import { memo, useContext, useState, useCallback, forwardRef } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import { isMobilePhone } from '../../../../../modules/isMobilePhone.js'
import { logout } from '../../../../../modules/logout.js'
import { EkfUser } from './EkfUser/index.jsx'
import { StoreContext } from '../../../../../storeContext.js'
import { IdbContext } from '../../../../../idbContext.js'
import { useSearchParamsState } from '../../../../../modules/useSearchParamsState.js'

const Container = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`
const MehrButton = styled(Button)`
  color: white !important;
  text-transform: none !important;
  // prevent text from breaking into multiple lines
  flex-shrink: 0;
  flex-grow: 0;
`
const Version = styled.div`
  padding: 12px 16px;
  color: rgba(0, 0, 0, 0.54);
  user-select: none;
`

export const More = memo(
  observer(
    forwardRef(({ onClickExporte: passedOnClickExporte, role }, ref) => {
      const { projId } = useParams()

      const store = useContext(StoreContext)
      const { deletedDatasets, user, setShowDeletions } = store
      const { idb } = useContext(IdbContext)

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
            ref={ref}
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
            <Version>Version: 1.114.4 vom 26.11.2024</Version>
          </Menu>
        </Container>
      )
    }),
  ),
)
