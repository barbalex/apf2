import { memo, useCallback } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Tooltip } from '@mui/material'
import { useAtom } from 'jotai'
import styled from '@emotion/styled'

import { alwaysShowNavigationListsAtom } from '../../../../../JotaiStore/index.js'
import { constants } from '../../../../../modules/constants.js'

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-right: 0 !important;
`

export const AlwaysShowNavigationLists = memo(() => {
  const [alwaysShowNavigationLists, setAlwaysShowNavigationLists] = useAtom(
    alwaysShowNavigationListsAtom,
  )
  const toggleAlwaysShowNavigationLists = useCallback(() => {
    setAlwaysShowNavigationLists(!alwaysShowNavigationLists)
  }, [alwaysShowNavigationLists, setAlwaysShowNavigationLists])

  return (
    <Tooltip
      title={`Navigations-Listen dienen der Navigation auf Mobilgeräten. Daher werden sie normalerweise nur auf schmalen Bildschirmen angezeigt (unter ${constants.mobileViewMaxWidth + 1} Pixeln Breite).`}
      placement={window.innerWidth > 730 ? 'left' : 'bottom'}
    >
      <StyledFormControlLabel
        control={
          <Checkbox
            checked={alwaysShowNavigationLists}
            onChange={toggleAlwaysShowNavigationLists}
          />
        }
        label="Navigations-Listen immer anzeigen"
      />
    </Tooltip>
  )
})
