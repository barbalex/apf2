import React, { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import {
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index'
import { StyledCardContent } from './index'

const ZuVieleDaten = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={() => setExpanded(!expanded)}>
        <CardActionTitle>Hilfe, das sind viel zu viele Daten!</CardActionTitle>
        <CardActionIconButton
          data-expanded={expanded}
          aria-expanded={expanded}
          aria-label="öffnen"
        >
          <Icon title={expanded ? 'schliessen' : 'öffnen'}>
            <ExpandMoreIcon />
          </Icon>
        </CardActionIconButton>
      </StyledCardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <StyledCardContent>
          {'Meist werden alle verfügbaren Datensätze und Felder exportiert.'}
          <br />
          {
            'Daher können Listen sehr viele Zeilen und Spalten enthalten und unübersichtlich werden.'
          }
          <ul>
            <li>Filtern Sie die Zeilen nach gewünschten Kriterien</li>
            <li>Blenden Sie unerwünschte Spalten aus oder löschen Sie sie</li>
          </ul>
        </StyledCardContent>
      </Collapse>
    </StyledCard>
  )
}

export default ZuVieleDaten
