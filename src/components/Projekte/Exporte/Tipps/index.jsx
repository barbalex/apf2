import { useState } from 'react'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { WasIstCsv } from './WasIstCsv.jsx'
import { CsvOeffnen } from './CsvOeffnen.jsx'
import { CsvProgramm } from './CsvProgramm.jsx'
import { DatenChaotisch } from './DatenChaotisch.jsx'
import { ZuVieleDaten } from './ZuVieleDaten.jsx'

import { ownCardContent, cardContent } from './index.module.css'
import { actionTitle, card, cardActions } from '../index.module.css'

export const Tipps = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={card}>
      <CardActions
        className={cardActions}
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={actionTitle}>Tipps und Tricks</div>
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
        {expanded ?
          <CardContent className={ownCardContent}>
            <WasIstCsv />
            <CsvOeffnen />
            <CsvProgramm />
            <DatenChaotisch />
            <ZuVieleDaten />
          </CardContent>
        : null}
      </Collapse>
    </Card>
  )
}
