import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { CardContent } from './CardContent.jsx'
import { CardActionIconButton } from '../index.jsx'
import { actionTitle, card, cardActions } from '../index.module.css'

export const Teilpopulationen = () => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = () => setExpanded(!expanded)

  return (
    <Card className={card}>
      <CardActions
        className={cardActions}
        disableSpacing
        onClick={onClickAction}
      >
        <div className={actionTitle}>Teilpopulationen</div>
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
          <CardContent />
        : null}
      </Collapse>
    </Card>
  )
}
