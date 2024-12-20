import { memo, useCallback } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Tooltip } from '@mui/material'
import { useAtom } from 'jotai'
import styled from '@emotion/styled'

import { showBookmarksMenuAtom } from '../../../../../JotaiStore/index.js'

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-right: 0 !important;
`

export const ShowBookmarksMenu = memo(() => {
  const [showBookmarksMenu, setShowBookmarksMenu] = useAtom(
    showBookmarksMenuAtom,
  )
  const toggleShowBookmarksMenu = useCallback(() => {
    setShowBookmarksMenu(!showBookmarksMenu)
  }, [showBookmarksMenu, setShowBookmarksMenu])

  return (
    <Tooltip
      title={`Soll am rechten Rand der Bookmarks ein Menü mit der Liste der nächsten Objekte bzw. Ordner angezeigt werden?`}
      placement={window.innerWidth > 730 ? 'left' : 'bottom'}
    >
      <StyledFormControlLabel
        control={
          <Checkbox
            checked={showBookmarksMenu}
            onChange={toggleShowBookmarksMenu}
          />
        }
        label="In Bookmarks ein Menü anzeigen"
      />
    </Tooltip>
  )
})
