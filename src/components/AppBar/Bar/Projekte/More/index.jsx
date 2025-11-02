import { useContext, useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { FaBars } from 'react-icons/fa6'
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
import {
  isMobileViewAtom,
  isDesktopViewAtom,
  enforceDesktopNavigationAtom,
  enforceMobileNavigationAtom,
  writeEnforceDesktopNavigationAtom,
} from '../../../../../JotaiStore/index.js'

import { iconButton } from '../index.module.css'
import { mehrButton, version } from './index.module.css'

export const More = observer(
  ({ onClickExporte: passedOnClickExporte, role }) => {
    const { projId } = useParams()

    const [isMobileView] = useAtom(isMobileViewAtom)

    const store = useContext(MobxContext)
    const { deletedDatasets, user, setShowDeletions } = store
    const { idb } = useContext(IdbContext)

    const [anchorEl, setAnchorEl] = useState(null)
    const closeMenu = () => setAnchorEl(null)

    /**
     * need to clone projekteTabs
     * because otherwise removing elements errors out (because elements are sealed)
     */
    const [projekteTabs] = useProjekteTabs()
    const exporteIsActive = !!projId

    const showDeletedDatasets = () => {
      closeMenu()
      // prevent following from happening
      // before setAnchor has finished
      setTimeout(() => setShowDeletions(true))
    }

    const onClickMehrButton = (event) => setAnchorEl(event.currentTarget)

    const onClickExporte = () => {
      closeMenu()
      // prevent following from happening
      // before setAnchor has finished
      setTimeout(() => passedOnClickExporte())
    }

    const onClickLogout = () => logout(idb)

    const onClickUptime = () => {
      window.open('https://uptime.apflora.ch')
      setAnchorEl(null)
    }

    return (
      <Tooltip title="Mehr Befehle">
        {isMobileView ?
          <Button
            aria-label="Mehr"
            aria-owns={anchorEl ? 'appbar-more-menu' : null}
            aria-haspopup="true"
            onClick={onClickMehrButton}
            data-id="appbar-more"
            width={42}
            className={iconButton}
          >
            <FaBars />
          </Button>
        : <Button
            aria-label="Mehr"
            aria-owns={anchorEl ? 'appbar-more-menu' : null}
            aria-haspopup="true"
            onClick={onClickMehrButton}
            data-id="appbar-more"
            className={mehrButton}
          >
            Mehr
          </Button>
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
          <div className={version}>Version: 1.124.25 vom 30.10.2025</div>
        </Menu>
      </Tooltip>
    )
  },
)
