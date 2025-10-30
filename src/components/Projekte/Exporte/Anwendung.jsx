import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import beziehungen from '../../../etc/beziehungen.png'

import {
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
  DownloadCardButton,
} from './index.jsx'
import { cardContent, actionTitle } from './index.module.css'

export const Anwendung = () => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = () => setExpanded(!expanded)
  const onClickGrafisch = () => window.open(beziehungen)

  return (
    <StyledCard>
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
            <DownloadCardButton
              onClick={onClickGrafisch}
              color="inherit"
            >
              Datenstruktur grafisch dargestellt
            </DownloadCardButton>
          </CardContent>
        : null}
      </Collapse>
    </StyledCard>
  )
}
