import { memo, useCallback } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Tooltip } from '@mui/material'
import { useAtom } from 'jotai'

import { alwaysShowBookmarksAtom } from '../../../../../JotaiStore/index.js'
import { constants } from '../../../../../modules/constants.js'

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
    >
      <FormControlLabel
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
