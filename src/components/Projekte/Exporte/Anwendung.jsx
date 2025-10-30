import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import beziehungen from '../../../etc/beziehungen.png'

import { CardActionIconButton } from './index.jsx'
import {
  cardContent,
  actionTitle,
  button,
  card,
  cardActions,
} from './index.module.css'

export const Anwendung = () => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = () => setExpanded(!expanded)
  const onClickGrafisch = () => window.open(beziehungen)

  return (
    <Card className={card}>
      <CardActions
        className={cardActions}
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
      </CardActions>
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
