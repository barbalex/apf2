import { memo, useContext, useState, useCallback, forwardRef } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { FaBars } from 'react-icons/fa6'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'
import { useAtom } from 'jotai'

import { logout } from '../../../../../modules/logout.js'
import { EkfUser } from './EkfUser/index.jsx'
import { MobxContext } from '../../../../../mobxContext.js'
import { IdbContext } from '../../../../../idbContext.js'
import { useProjekteTabs } from '../../../../../modules/useProjekteTabs.js'
import { ShowBookmarksMenu } from './ShowBookmarksMenu.jsx'
import { EnforceDesktopNavigation } from './EnforceDesktopNavigation.jsx'
import { EnforceMobileNavigation } from './EnforceMobileNavigation.jsx'
import { AlwaysShowTree } from './AlwaysShowTree.jsx'
import { constants } from '../../../../../modules/constants.js'
import {
  isMobileViewAtom,
  isDesktopViewAtom,
  enforceDesktopNavigationAtom,
  enforceMobileNavigationAtom,
  writeEnforceDesktopNavigationAtom,
} from '../../../../../JotaiStore/index.js'
import { StyledIconButton } from '../index.jsx'

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
  observer(({ onClickExporte: passedOnClickExporte, role }) => {
    const { projId } = useParams()

    const [isMobileView] = useAtom(isMobileViewAtom)

    const store = useContext(MobxContext)
    const { deletedDatasets, user, setShowDeletions } = store
    const { idb } = useContext(IdbContext)

    const [anchorEl, setAnchorEl] = useState(null)
    const closeMenu = useCallback(() => setAnchorEl(null), [])

    /**
     * need to clone projekteTabs
     * because otherwise removing elements errors out (because elements are sealed)
     */
    const [projekteTabs] = useProjekteTabs()
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
      <Tooltip title="Mehr Befehle">
        {isMobileView ?
          <StyledIconButton
            aria-label="Mehr"
            aria-owns={anchorEl ? 'appbar-more-menu' : null}
            aria-haspopup="true"
            onClick={onClickMehrButton}
            data-id="appbar-more"
            width={42}
          >
            <FaBars />
          </StyledIconButton>
        : <MehrButton
            aria-label="Mehr"
            aria-owns={anchorEl ? 'appbar-more-menu' : null}
            aria-haspopup="true"
            onClick={onClickMehrButton}
            data-id="appbar-more"
          >
            Mehr
          </MehrButton>
        }
        <Menu
          id="appbar-more-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
        >
          {isMobileView && exporteIsActive && (
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
          <MenuItem>
            <EnforceMobileNavigation />
          </MenuItem>
          {isMobileView && (
            <MenuItem>
              <ShowBookmarksMenu />
            </MenuItem>
          )}
          <MenuItem>
            <EnforceDesktopNavigation />
          </MenuItem>
          <MenuItem>
            <AlwaysShowTree />
          </MenuItem>
          <MenuItem
            onClick={onClickLogout}
            data-id="appbar-more-logout"
          >{`${user.name} abmelden (und Cache leeren)`}</MenuItem>
          <MenuItem onClick={onClickUptime}>
            Verfügbarkeit der Server von apflora.ch
          </MenuItem>
          <Version>Version: 1.115.15 vom 5.06.2025</Version>
        </Menu>
      </Tooltip>
    )
  }),
)
