import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import {
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index.jsx'
import { cardContent } from './index.module.css'
import { actionTitle } from '../index.module.css'

export const DatenChaotisch = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={actionTitle}>
          Sind die Daten ungeordnet und chaotisch?
        </div>
        <Tooltip title={expanded ? 'schliessen' : 'öffnen'}>
          <CardActionIconButton
            data-expanded={expanded}
            aria-expanded={expanded}
            aria-label={expanded ? 'schliessen' : 'öffnen'}
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
        <CardContent className={cardContent}>
          {
            'Das Programm hat wohl beim Öffnen die Feld-Grenzen nicht richtig erkannt.'
          }
          <ul>
            <li>{'Öffnen Sie die Datei nochmals'}</li>
            <li>
              {
                'Suchen Sie dabei die Option, mit der eine Trennung der Felder mittels Kommas erzwungen werden kann'
              }
            </li>
            <li>
              {
                'Vielleicht muss wie in Excel statt dem Öffnen-Befehl ein Import-Befehl verwendet werden'
              }
            </li>
            <li>
              {
                'Vorsicht: Es sollte nicht noch zusätzlich eine andere Option gewählt sein, z.B. Trennung durch Kommas UND Strichpunkte'
              }
            </li>
          </ul>
        </CardContent>
      </Collapse>
    </StyledCard>
  )
}
