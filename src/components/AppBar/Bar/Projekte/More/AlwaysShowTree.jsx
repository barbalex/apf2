import { memo, useCallback } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Tooltip } from '@mui/material'
import { useAtom } from 'jotai'

import { alwaysShowTreeAtom } from '../../../../../JotaiStore/index.js'
import { constants } from '../../../../../modules/constants.js'

export const AlwaysShowTree = memo(() => {
  const [alwaysShowTree, setAlwaysShowTree] = useAtom(alwaysShowTreeAtom)
  const toggleAlwaysShowTree = useCallback(() => {
    setAlwaysShowTree(!alwaysShowTree)
  }, [alwaysShowTree, setAlwaysShowTree])

  return (
    <Tooltip
      title={`Wird normalerweise nur auf grossen Bildschirmen angezeigt (ab ${constants.mobileViewMaxWidth + 1} Pixeln)`}
    >
      <FormControlLabel
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
