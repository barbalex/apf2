import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { cardContent } from './index.module.css'
import { actionTitle, card, cardActions } from '../index.module.css'

export const DatenChaotisch = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={card}>
      <CardActions
        className={cardActions}
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={actionTitle}>
          Sind die Daten ungeordnet und chaotisch?
        </div>
        <Tooltip title={expanded ? 'schliessen' : 'öffnen'}>
          <IconButton
            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
            aria-expanded={expanded}
            aria-label={expanded ? 'schliessen' : 'öffnen'}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
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
    </Card>
  )
}
