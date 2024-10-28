import React, { useState } from 'react'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from '@emotion/styled'

import { WasIstCsv } from './WasIstCsv.jsx'
import { CsvOeffnen } from './CsvOeffnen.jsx'
import CsvProgramm from './CsvProgramm.jsx'
import DatenChaotisch from './DatenChaotisch.jsx'
import ZuVieleDaten from './ZuVieleDaten.jsx'
import {
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index.jsx'

const OwnStyledCardContent = styled(CardContent)`
  margin: -15px 0 0 0;
`
export const StyledCardContent = styled(CardContent)`
  margin: -15px 0 0 0;
  ol {
    -webkit-padding-start: 16px;
  }
  li {
    margin-top: 4px;
  }
`

export const Tipps = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <CardActionTitle>Tipps und Tricks</CardActionTitle>
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
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        {expanded ?
          <OwnStyledCardContent>
            <WasIstCsv />
            <CsvOeffnen />
            <CsvProgramm />
            <DatenChaotisch />
            <ZuVieleDaten />
          </OwnStyledCardContent>
        : null}
      </Collapse>
    </StyledCard>
  )
}
