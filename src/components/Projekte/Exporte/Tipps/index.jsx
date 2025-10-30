import { useState } from 'react'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { WasIstCsv } from './WasIstCsv.jsx'
import { CsvOeffnen } from './CsvOeffnen.jsx'
import { CsvProgramm } from './CsvProgramm.jsx'
import { DatenChaotisch } from './DatenChaotisch.jsx'
import { ZuVieleDaten } from './ZuVieleDaten.jsx'

import {
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index.jsx'
import { ownCardContent, cardContent } from './index.module.css'
import { actionTitle } from '../index.module.css'

export const Tipps = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={actionTitle}>Tipps und Tricks</div>
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
    </StyledCard>
  )
}
