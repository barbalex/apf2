import React, { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import {
  StyledCardContent,
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index'
import Kontrollen from './Kontrollen'
import KontrFuerWebgisBun from './KontrFuerWebgisBun'
import KontrAnzProZaehlEinheit from './KontrAnzProZaehlEinheit'

const KontrollenComponent = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={() => setExpanded(!expanded)}>
        <CardActionTitle>Kontrollen</CardActionTitle>
        <CardActionIconButton
          data-expanded={expanded}
          aria-expanded={expanded}
          aria-label="öffnen"
          color="inherit"
        >
          <Icon title={expanded ? 'schliessen' : 'öffnen'}>
            <ExpandMoreIcon />
          </Icon>
        </CardActionIconButton>
      </StyledCardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {expanded ? (
          <StyledCardContent>
            <Kontrollen />
            <Kontrollen filtered={true} />
            <KontrFuerWebgisBun />
            <KontrAnzProZaehlEinheit />
          </StyledCardContent>
        ) : null}
      </Collapse>
    </StyledCard>
  )
}

export default KontrollenComponent
