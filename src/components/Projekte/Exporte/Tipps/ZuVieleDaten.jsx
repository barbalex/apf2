import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import {
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index.jsx'
import { cardContent } from './index.module.css'

export const ZuVieleDaten = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <CardActionTitle>Hilfe, das sind viel zu viele Daten!</CardActionTitle>
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
    </StyledCard>
  )
}
