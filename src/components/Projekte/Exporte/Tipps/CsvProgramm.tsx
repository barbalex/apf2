import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { CsvInExcelOeffnen } from './CsvInExcelOeffnen.jsx'
import tippsStyles from './index.module.css'
import styles from '../index.module.css'

export const CsvProgramm = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={styles.card}>
      <CardActions
        className={styles.cardActions}
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={styles.actionTitle}>
          Welches Programm soll ich dazu verwenden?
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
        <CardContent className={tippsStyles.cardContent}>
          {
            'Um die Datei das erste Mal zu öffnen eignet sich Libre Office am besten: '
          }
          <a
            href="https://de.libreoffice.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://de.libreoffice.org
          </a>
          <p>
            {
              'Microsoft Excel eignet sich sehr gut, um die Daten danach auswerten.'
            }
            <br />
            {
              'Speichern Sie die Datei daher in Libre Office als .xlsx-Datei ab und öffnen Sie sie danach mit Excel.'
            }
          </p>
          <CsvInExcelOeffnen />
        </CardContent>
      </Collapse>
    </Card>
  )
}
