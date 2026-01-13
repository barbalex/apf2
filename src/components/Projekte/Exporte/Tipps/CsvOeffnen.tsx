import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import tippsStyles from './index.module.css'
import styles from '../index.module.css'

export const CsvOeffnen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={styles.card}>
      <CardActions
        className={styles.cardActions}
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={styles.actionTitle}>Wie öffne ich eine .csv-Datei?</div>
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
        <CardContent className={tippsStyles.cardContent}>
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
        </CardContent>
      </Collapse>
    </Card>
  )
}
