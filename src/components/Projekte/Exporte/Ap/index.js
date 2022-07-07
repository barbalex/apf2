import React, { useState, useCallback } from 'react'
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
import Ap from './Ap'
import ApOhnePop from './ApOhnePop'
import AnzMassn from './AnzMassn'
import AnzKontr from './AnzKontr'
import Ber from './Ber'
import BerUndMassn from './BerUndMassn'
import PriorisierungFuerEk from './PriorisierungFuerEk'
import EkPlanung from './EkPlanung'
import Ziele from './Ziele'
import Zielber from './Zielber'
import Erfkrit from './Erfkrit'
import Idealbiotop from './Idealbiotop'
import Assozart from './Assozart'

const ApExports = ({ treeName }) => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = useCallback(() => setExpanded(!expanded), [expanded])

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={onClickAction}>
        <CardActionTitle>Art</CardActionTitle>
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
            <Ap treeName={treeName} />
            <Ap treeName={treeName} filtered={true} />
            <ApOhnePop />
            <AnzMassn />
            <AnzKontr />
            <Ber />
            <BerUndMassn />
            <PriorisierungFuerEk />
            <EkPlanung />
            <Ziele />
            <Zielber />
            <Erfkrit />
            <Idealbiotop />
            <Assozart />
          </StyledCardContent>
        ) : null}
      </Collapse>
    </StyledCard>
  )
}

export default ApExports
