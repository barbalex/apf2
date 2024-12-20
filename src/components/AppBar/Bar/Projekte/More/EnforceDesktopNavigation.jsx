import { memo, useCallback } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Tooltip } from '@mui/material'
import { useAtom } from 'jotai'
import styled from '@emotion/styled'

import {
  enforceDesktopNavigationAtom,
  writeEnforceDesktopNavigationAtom,
} from '../../../../../JotaiStore/index.js'
import { constants } from '../../../../../modules/constants.js'

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-right: 0 !important;
`

export const EnforceDesktopNavigation = memo(() => {
  const [enforceDesktopNavigation] = useAtom(enforceDesktopNavigationAtom)
  const [, setEnforceDesktopNavigation] = useAtom(
    writeEnforceDesktopNavigationAtom,
  )
  const toggleEnforceDesktopNavigation = useCallback(() => {
    setEnforceDesktopNavigation(!enforceDesktopNavigation)
  }, [enforceDesktopNavigation, setEnforceDesktopNavigation])

  return (
    <Tooltip
      title={`Desktop-Navigation funktioniert mit dem Navigationsbaum. Sie wird normalerweise nur auf grossen Bildschirmen verwendet (ab ${constants.mobileViewMaxWidth + 1} Pixeln Breite).`}
      placement={window.innerWidth > 730 ? 'left' : 'bottom'}
    >
      <StyledFormControlLabel
        control={
          <Checkbox
            checked={enforceDesktopNavigation}
            onChange={toggleEnforceDesktopNavigation}
          />
        }
        label="Desktop-Navigation erzwingen"
      />
    </Tooltip>
  )
})
