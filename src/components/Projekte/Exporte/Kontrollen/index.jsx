import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import {
  StyledCardContent,
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index.jsx'
import { Kontrollen as KontrollenComponent } from './Kontrollen.jsx'
import { KontrFuerWebgisBun } from './KontrFuerWebgisBun.jsx'
import { KontrAnzProZaehlEinheit } from './KontrAnzProZaehlEinheit.jsx'
import { InfoFlora } from './InfoFlora.jsx'

export const Kontrollen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <CardActionTitle>Kontrollen</CardActionTitle>
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
            <KontrollenComponent />
            <KontrollenComponent filtered={true} />
            <KontrFuerWebgisBun />
            <KontrAnzProZaehlEinheit />
            <InfoFlora />
          </StyledCardContent>
        : null}
      </Collapse>
    </StyledCard>
  )
}
