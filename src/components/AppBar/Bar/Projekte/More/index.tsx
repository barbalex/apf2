import { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { FaBars } from 'react-icons/fa6'
import { useParams } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'

import { logout } from '../../../../../modules/logout.ts'
import { EkfUser } from './EkfUser/index.tsx'
import { useProjekteTabs } from '../../../../../modules/useProjekteTabs.ts'
import { ShowBookmarksMenu } from './ShowBookmarksMenu.tsx'
import { EnforceDesktopNavigation } from './EnforceDesktopNavigation.tsx'
import { EnforceMobileNavigation } from './EnforceMobileNavigation.tsx'
import { AlwaysShowTree } from './AlwaysShowTree.tsx'
import {
  isMobileViewAtom,
  isDesktopViewAtom,
  enforceDesktopNavigationAtom,
  enforceMobileNavigationAtom,
  writeEnforceDesktopNavigationAtom,
  userNameAtom,
  deletedDatasetsAtom,
  setShowDeletionsAtom,
} from '../../../../../store/index.ts'

import parentStyles from '../index.module.css'
import styles from './index.module.css'

export const More = ({ onClickExporte: passedOnClickExporte, role }) => {
  const { projId } = useParams()

  const isMobileView = useAtomValue(isMobileViewAtom)

  const setShowDeletions = useSetAtom(setShowDeletionsAtom)
  const deletedDatasets = useAtomValue(deletedDatasetsAtom)
  const userName = useAtomValue(userNameAtom)

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
          className={parentStyles.iconButton}
        >
          <FaBars />
        </Button>
      : <Button
          aria-label="Mehr"
          aria-owns={anchorEl ? 'appbar-more-menu' : null}
          aria-haspopup="true"
          onClick={onClickMehrButton}
          data-id="appbar-more"
          className={styles.mehrButton}
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
          onClick={logout}
          data-id="appbar-more-logout"
        >{`${userName} abmelden (und Cache leeren)`}</MenuItem>
        <MenuItem onClick={onClickUptime}>
          Verfügbarkeit der Server von apflora.ch
        </MenuItem>
        <div className={styles.version}>Version: 1.124.66 vom 29.1.2026</div>
      </Menu>
    </Tooltip>
  )
}
