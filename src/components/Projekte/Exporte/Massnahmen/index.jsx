import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import MuiCardContent from '@mui/material/CardContent'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import {
  StyledCardContent,
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index.jsx'
import { Massnahmen as MassnahmenComponent } from './Massnahmen.jsx'
import { MassnWebgisBun } from './MassnWebgisBun.jsx'

export const Massnahmen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <CardActionTitle>Massnahmen</CardActionTitle>
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
          <StyledCardContent>
            <MassnahmenComponent />
            <MassnahmenComponent filtered={true} />
            <MassnWebgisBun />
          </StyledCardContent>
        : null}
      </Collapse>
    </StyledCard>
  )
}
