import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import {
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index.jsx'
import { cardContent } from './index.module.css'
import { actionTitle } from '../index.module.css'

export const WasIstCsv = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={actionTitle}>Was ist eine .csv-Datei?</div>
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
          {'Eine reine Textdatei, deren Name mit ".csv" endet.'}
          <br />
          {'"csv" steht für: "comma separated values".'}
          <br />
          {'Die Datei hat folgende Eigenschaften:'}
          <ol>
            <li>
              {
                'Datenbank-Felder werden mit Kommas (,) getrennt ("Feldtrenner")'
              }
            </li>
            <li>
              {
                'Text in Feldern wird in Hochzeichen (") eingefasst ("Texttrenner")'
              }
            </li>
            <li>{'Die erste Zeile enthält die Feldnamen'}</li>
            <li>
              {'Der Zeichenstatz ist Unicode UTF-8'}
              <br />
              {
                'Ist ein falscher Zeichensatz gewählt, werden Sonderzeichen wie z.B. Umlaute falsch angezeigt.'
              }
            </li>
          </ol>
        </CardContent>
      </Collapse>
    </StyledCard>
  )
}
