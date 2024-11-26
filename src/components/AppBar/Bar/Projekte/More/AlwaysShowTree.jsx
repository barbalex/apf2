import { memo, useCallback } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Tooltip } from '@mui/material'
import { useAtom } from 'jotai'
import styled from '@emotion/styled'

import { alwaysShowTreeAtom } from '../../../../../JotaiStore/index.js'
import { constants } from '../../../../../modules/constants.js'

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-right: 0 !important;
`

export const AlwaysShowTree = memo(() => {
  const [alwaysShowTree, setAlwaysShowTree] = useAtom(alwaysShowTreeAtom)
  const toggleAlwaysShowTree = useCallback(() => {
    setAlwaysShowTree(!alwaysShowTree)
  }, [alwaysShowTree, setAlwaysShowTree])

  return (
    <Tooltip
      title={`Wird normalerweise nur auf grossen Bildschirmen angezeigt (ab ${constants.mobileViewMaxWidth + 1} Pixeln)`}
      // if window width > 731 left
      placement={window.innerWidth > 730 ? 'left' : 'bottom'}
    >
      <StyledFormControlLabel
        control={
          <Checkbox
            checked={alwaysShowTree}
            onChange={toggleAlwaysShowTree}
          />
        }
        label="Navigationsbaum immer anzeigen"
      />
    </Tooltip>
  )
})
