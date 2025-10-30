import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { Kontrollen as KontrollenComponent } from './Kontrollen.jsx'
import { KontrFuerWebgisBun } from './KontrFuerWebgisBun.jsx'
import { KontrAnzProZaehlEinheit } from './KontrAnzProZaehlEinheit.jsx'
import { InfoFlora } from './InfoFlora.jsx'

import { StyledCardActions, CardActionIconButton } from '../index.jsx'
import { cardContent, actionTitle, card } from '../index.module.css'

export const Kontrollen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={card}>
      <StyledCardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={actionTitle}>Kontrollen</div>
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
          <CardContent className={cardContent}>
            <KontrollenComponent />
            <KontrollenComponent filtered={true} />
            <KontrFuerWebgisBun />
            <KontrAnzProZaehlEinheit />
            <InfoFlora />
          </CardContent>
        : null}
      </Collapse>
    </Card>
  )
}
