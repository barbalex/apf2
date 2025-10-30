import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import beziehungen from '../../../etc/beziehungen.png'

import { StyledCardActions, CardActionIconButton } from './index.jsx'
import { cardContent, actionTitle, button, card } from './index.module.css'

export const Anwendung = () => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = () => setExpanded(!expanded)
  const onClickGrafisch = () => window.open(beziehungen)

  return (
    <Card className={card}>
      <StyledCardActions
        disableSpacing
        onClick={onClickAction}
      >
        <div className={actionTitle}>Anwendung</div>
        <Tooltip title={expanded ? 'schliessen' : 'öffnen'}>
          <CardActionIconButton
            data-expanded={expanded}
            aria-expanded={expanded}
            aria-label={expanded ? 'schliessen' : 'öffnen'}
            color="inherit"
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
        {expanded ?
          <CardContent className={cardContent}>
            <Button
              className={button}
              onClick={onClickGrafisch}
              color="inherit"
            >
              Datenstruktur grafisch dargestellt
            </Button>
          </CardContent>
        : null}
      </Collapse>
    </Card>
  )
}
