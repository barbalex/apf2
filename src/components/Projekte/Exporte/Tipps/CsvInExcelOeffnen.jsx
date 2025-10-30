import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { CardActionIconButton } from '../index.jsx'
import { cardContent } from './index.module.css'
import { actionTitle, card, cardActions } from '../index.module.css'

export const CsvInExcelOeffnen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={card}>
      <CardActions
        className={cardActions}
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={actionTitle}>
          Sie wollen die .csv-Datei direkt in Excel öffnen? Das wird nicht
          empfohlen, aber hier erfahren Sie, wie es funktionieren kann:
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
      </CardActions>
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        <CardContent className={cardContent}>
          <ol>
            <li>Excel öffnen</li>
            <li>{'"Daten" > "Externe Daten abrufen" > "Aus Text" wählen'}</li>
            <li>
              {'Nun erscheit der Textkonvertierungs-Assistent.'}
              <br />
              {
                'Im Schritt 1 als Dateiursprung statt dem vorgegebenen "Windows (ANSI)" dies hier wählen: "65001 : Unicode (UTF-8)". Excel versteht sonst partout keine Umlaute.'
              }
            </li>
            <li>
              {'Vorsicht: Excel vermanscht regelmässig importierte Daten!'}
              <br />
              {
                'Beim Importieren interpretiert es nämlich in jedem Feld die obersten paar Datensätze - und bestimmt einen Datentyp, ohne Sie zu fragen.'
              }
              <br />
              {
                'Auch wenn weiter unten in vielen Datensätzen die Daten bei der nun nötigen Umwandlung in diesen Datentyp in diesem Feld dadurch verändert oder gelöscht werden, weil sie nicht diesem Datentyp entsprechen.'
              }
              <br />
              {
                'Daher bitte Excel nur für die Auswertung von Daten benutzten - nicht um .csv-Dateien zu öffnen.'
              }
            </li>
          </ol>
        </CardContent>
      </Collapse>
    </Card>
  )
}
