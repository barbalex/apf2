import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Tooltip } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  enforceMobileNavigationAtom,
  writeEnforceMobileNavigationAtom,
} from '../../../../../store/index.ts'
import { constants } from '../../../../../modules/constants.ts'

import styles from './AlwaysShowTree.module.css'

export const EnforceMobileNavigation = () => {
  const enforceMobileNavigation = useAtomValue(enforceMobileNavigationAtom)
  const setEnforceMobileNavigation = useSetAtom(
    writeEnforceMobileNavigationAtom,
  )
  const toggleEnforceMobileNavigation = () =>
    setEnforceMobileNavigation(!enforceMobileNavigation)

  return (
    <Tooltip
      title={`Mobile-Navigation funktioniert mit Bookmarks und Navigationslisten. Sie wird normalerweise nur auf kleinen Bildschirmen verwendet (unter ${constants.mobileViewMaxWidth + 1} Pixeln Breite).`}
      placement={window.innerWidth > 730 ? 'left' : 'bottom'}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={enforceMobileNavigation}
            onChange={toggleEnforceMobileNavigation}
          />
        }
        label="Mobile-Navigation erzwingen"
        className={styles.formControlLabel}
      />
    </Tooltip>
  )
}
