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
} from '../index.jsx'
import { Ap as ApComponent } from './Ap.jsx'
import { ApOhnePop } from './ApOhnePop.jsx'
import { AnzMassn } from './AnzMassn.jsx'
import { AnzKontr } from './AnzKontr.jsx'
import { Ber } from './Ber.jsx'
import { BerUndMassn } from './BerUndMassn.jsx'
import { PriorisierungFuerEk } from './PriorisierungFuerEk.jsx'
import { EkPlanung } from './EkPlanung.jsx'
import { Ziele } from './Ziele.jsx'
import { Zielber } from './Zielber.jsx'
import Erfkrit from './Erfkrit.jsx'
import Idealbiotop from './Idealbiotop.jsx'
import Assozart from './Assozart.jsx'

export const Ap = () => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = useCallback(() => setExpanded(!expanded), [expanded])

  return (
    <StyledCard>
      <StyledCardActions
        disableSpacing
        onClick={onClickAction}
      >
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
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        {expanded ?
          <StyledCardContent>
            <ApComponent />
            <ApComponent filtered={true} />
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
        : null}
      </Collapse>
    </StyledCard>
  )
}
