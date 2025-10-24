import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Tooltip } from '@mui/material'
import { useAtom } from 'jotai'
import styled from '@emotion/styled'

import {
  enforceMobileNavigationAtom,
  writeEnforceMobileNavigationAtom,
} from '../../../../../JotaiStore/index.js'
import { constants } from '../../../../../modules/constants.js'

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-right: 0 !important;
`

export const EnforceMobileNavigation = () => {
  const [enforceMobileNavigation] = useAtom(enforceMobileNavigationAtom)
  const [, setEnforceMobileNavigation] = useAtom(
    writeEnforceMobileNavigationAtom,
  )
  const toggleEnforceMobileNavigation = () =>
    setEnforceMobileNavigation(!enforceMobileNavigation)

  return (
    <Tooltip
      title={`Mobile-Navigation funktioniert mit Bookmarks und Navigationslisten. Sie wird normalerweise nur auf kleinen Bildschirmen verwendet (unter ${constants.mobileViewMaxWidth + 1} Pixeln Breite).`}
      placement={window.innerWidth > 730 ? 'left' : 'bottom'}
    >
      <StyledFormControlLabel
        control={
          <Checkbox
            checked={enforceMobileNavigation}
            onChange={toggleEnforceMobileNavigation}
          />
        }
        label="Mobile-Navigation erzwingen"
      />
    </Tooltip>
  )
}
