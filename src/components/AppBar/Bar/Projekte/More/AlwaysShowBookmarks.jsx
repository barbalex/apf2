import { memo, useCallback } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Tooltip } from '@mui/material'
import { useAtom } from 'jotai'
import styled from '@emotion/styled'

import { alwaysShowBookmarksAtom } from '../../../../../JotaiStore/index.js'
import { constants } from '../../../../../modules/constants.js'

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-right: 0 !important;
`

export const AlwaysShowBookmarks = memo(() => {
  const [alwaysShowBookmarks, setAlwaysShowBookmarks] = useAtom(
    alwaysShowBookmarksAtom,
  )
  const toggleAlwaysShowBookmarks = useCallback(() => {
    setAlwaysShowBookmarks(!alwaysShowBookmarks)
  }, [alwaysShowBookmarks, setAlwaysShowBookmarks])

  return (
    <Tooltip
      title={`Wird normalerweise nur auf schmalen Bildschirmen angezeigt (unter ${constants.mobileViewMaxWidth + 1} Pixeln)`}
      placement={window.innerWidth > 730 ? 'left' : 'bottom'}
    >
      <StyledFormControlLabel
        control={
          <Checkbox
            checked={alwaysShowBookmarks}
            onChange={toggleAlwaysShowBookmarks}
          />
        }
        label="Bookmark-Navigationsmenü immer anzeigen"
      />
    </Tooltip>
  )
})
