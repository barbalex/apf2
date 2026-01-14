import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Tooltip } from '@mui/material'
import { useAtom } from 'jotai'

import {
  enforceDesktopNavigationAtom,
  writeEnforceDesktopNavigationAtom,
} from '../../../../../JotaiStore/index.ts'
import { constants } from '../../../../../modules/constants.js'

import styles from './AlwaysShowTree.module.css'

export const EnforceDesktopNavigation = () => {
  const [enforceDesktopNavigation] = useAtom(enforceDesktopNavigationAtom)
  const [, setEnforceDesktopNavigation] = useAtom(
    writeEnforceDesktopNavigationAtom,
  )
  const toggleEnforceDesktopNavigation = () =>
    setEnforceDesktopNavigation(!enforceDesktopNavigation)

  return (
    <Tooltip
      title={`Desktop-Navigation funktioniert mit dem Navigationsbaum. Sie wird normalerweise nur auf grossen Bildschirmen verwendet (ab ${constants.mobileViewMaxWidth + 1} Pixeln Breite).`}
      placement={window.innerWidth > 730 ? 'left' : 'bottom'}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={enforceDesktopNavigation}
            onChange={toggleEnforceDesktopNavigation}
          />
        }
        label="Desktop-Navigation erzwingen"
        className={styles.formControlLabel}
      />
    </Tooltip>
  )
}
