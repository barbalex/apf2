import { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// MenuBar measures its children via a width prop that MUI's Button doesn't declare
const WidthButton = Button as unknown as React.ComponentType<
  React.ComponentProps<typeof Button> & { width?: number }
>

// MUI Tooltip types children as a single element; this Tooltip also wraps the Menu
const MultiChildTooltip = Tooltip as unknown as React.ComponentType<
  Omit<React.ComponentProps<typeof Tooltip>, 'children'> & {
    children?: React.ReactNode
  }
>
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
  userNameAtom,
  deletedDatasetsAtom,
  setShowDeletionsAtom,
} from '../../../../../store/index.ts'
import {
  version as appVersion,
  versionDate,
} from '../../../../../../package.json'

import parentStyles from '../index.module.css'
import styles from './index.module.css'

interface MoreProps {
  onClickExporte: () => void
  role: string | null | undefined
  // read by MenuBar to compute the menu widths
  width?: number
}

export const More = ({
  onClickExporte: passedOnClickExporte,
  role,
}: MoreProps) => {
  const { projId } = useParams()

  const isMobileView = useAtomValue(isMobileViewAtom)

  const setShowDeletions = useSetAtom(setShowDeletionsAtom)
  const deletedDatasets = useAtomValue(deletedDatasetsAtom)
  const userName = useAtomValue(userNameAtom)

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
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

  const onClickMehrButton = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)

  const onClickExporte = () => {
    closeMenu()
    // prevent following from happening
    // before setAnchor has finished
    setTimeout(() => passedOnClickExporte())
  }

  const onClickUptime = () => {
    window.open('https://uptime.gabriel-software.ch')
    setAnchorEl(null)
  }

  return (
    <MultiChildTooltip title="Mehr Befehle">
      {isMobileView ?
        <WidthButton
          aria-label="Mehr"
          aria-owns={anchorEl ? 'appbar-more-menu' : undefined}
          aria-haspopup="true"
          onClick={onClickMehrButton}
          data-id="appbar-more"
          width={42}
          className={parentStyles.iconButton}
        >
          <FaBars />
        </WidthButton>
      : <WidthButton
          aria-label="Mehr"
          aria-owns={anchorEl ? 'appbar-more-menu' : undefined}
          aria-haspopup="true"
          onClick={onClickMehrButton}
          data-id="appbar-more"
          className={styles.mehrButton}
        >
          Mehr
        </WidthButton>
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
        {['apflora_manager', 'apflora_ap_writer'].includes(role ?? '') && (
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
          onClick={() => void logout()}
          data-id="appbar-more-logout"
        >{`${userName} abmelden (und Cache leeren)`}</MenuItem>
        <MenuItem onClick={onClickUptime}>
          Verfügbarkeit der Server von apflora.ch
        </MenuItem>
        <div className={styles.version}>
          Version: {appVersion} vom {versionDate}
        </div>
      </Menu>
    </MultiChildTooltip>
  )
}
