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
} from '../index.jsx'
import { Pops } from './Pops.jsx'
import { PopsForGoogleEarth } from './PopsForGoogleEarth.jsx'
import { PopsForGEArtname } from './PopsForGEArtname.jsx'
import { ApOhneStatus } from './ApOhneStatus.jsx'
import { OhneKoord } from './OhneKoord.jsx'
import { AnzMassnBerichtsjahr } from './AnzMassnBerichtsjahr.jsx'
import { AnzMassnProPop } from './AnzMassnProPop.jsx'
import { AnzKontrProPop } from './AnzKontrProPop.jsx'
import Berichte from './Berichte.jsx'
import LetzterPopBericht from './LetzterPopBericht.jsx'
import LetzterMassnBericht from './LetzterMassnBericht.jsx'
import LetzteZaehlung from './LetzteZaehlung.jsx'
import LetzteZaehlungInklAnpflanz from './LetzteZaehlungInklAnpflanz.jsx'

export const Populationen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <CardActionTitle>Populationen</CardActionTitle>
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
            <Pops />
            <Pops filtered={true} />
            <PopsForGoogleEarth />
            <PopsForGEArtname />
            <ApOhneStatus />
            <OhneKoord />
            <AnzMassnBerichtsjahr />
            <AnzMassnProPop />
            <AnzKontrProPop />
            <Berichte />
            <LetzterPopBericht />
            <LetzterMassnBericht />
            <LetzteZaehlung />
            <LetzteZaehlungInklAnpflanz />
          </StyledCardContent>
        : null}
      </Collapse>
    </StyledCard>
  )
}
