import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import {
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index.jsx'
import { StyledCardContent } from './index.jsx'

export const CsvOeffnen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <CardActionTitle>Wie öffne ich eine .csv-Datei?</CardActionTitle>
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
        <StyledCardContent>
          Es gibt zwei Möglichkeiten:
          <ol>
            <li>
              {'Heruntergeladene Datei doppelklicken.'}
              <br />
              {'Meist wählt das Betriebssystem ein geeignetes Programm.'}
              <br />
              {
                'Dieses Programm erkennt hoffentlich, dass der Importassistent verwendet werden muss.'
              }
              <br />
              {'In Excel funktioniert dies häufig nicht!'}
            </li>
            <li>
              {
                'Gewünschtes Programm öffnen und damit die Datei öffnen (z.B. in Libre Office) oder die Daten importieren (z.B. in Excel).'
              }
              <br />
              {
                'Das Programm öffnet den Importassistenten, in dem man Feldtrenner, Texttrenner und Zeichensatz wählt. Und, ob die erste Zeile die Feldnamen enthält.'
              }
            </li>
          </ol>
        </StyledCardContent>
      </Collapse>
    </StyledCard>
  )
}
