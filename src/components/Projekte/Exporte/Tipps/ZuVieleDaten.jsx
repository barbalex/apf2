import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { CardActionIconButton } from '../index.jsx'
import { cardContent } from './index.module.css'
import { actionTitle, card, cardActions } from '../index.module.css'

export const ZuVieleDaten = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={card}>
      <CardActions
        className={cardActions}
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={actionTitle}>Hilfe, das sind viel zu viele Daten!</div>
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
          {'Meist werden alle verfügbaren Datensätze und Felder exportiert.'}
          <br />
          {
            'Daher können Listen sehr viele Zeilen und Spalten enthalten und unübersichtlich werden.'
          }
          <ul>
            <li>Filtern Sie die Zeilen nach gewünschten Kriterien</li>
            <li>Blenden Sie unerwünschte Spalten aus oder löschen Sie sie</li>
          </ul>
        </CardContent>
      </Collapse>
    </Card>
  )
}
