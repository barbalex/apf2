import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import Card from '@mui/material/Card'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { CardContent } from './CardContent.jsx'
import { StyledCardActions, CardActionIconButton } from '../index.jsx'
import { actionTitle, card } from '../index.module.css'

export const Teilpopulationen = () => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = () => setExpanded(!expanded)

  return (
    <Card className={card}>
      <StyledCardActions
        disableSpacing
        onClick={onClickAction}
      >
        <div className={actionTitle}>Teilpopulationen</div>
        <Tooltip title={expanded ? 'schliessen' : 'öffnen'}>
          <CardActionIconButton
            data-expanded={expanded}
            aria-expanded={expanded}
            aria-label={expanded ? 'schliessen' : 'öffnen'}
            color="inherit"
          >
            <ExpandMoreIcon />
          </CardActionIconButton>
        </Tooltip>
      </StyledCardActions>
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        {expanded ?
          <CardContent />
        : null}
      </Collapse>
    </Card>
  )
}
