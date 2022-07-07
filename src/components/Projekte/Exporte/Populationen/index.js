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
import Pops from './Pops'
import PopsForGoogleEarth from './PopsForGoogleEarth'
import PopsForGEArtname from './PopsForGEArtname'
import ApOhneStatus from './ApOhneStatus'
import OhneKoord from './OhneKoord'
import AnzMassnBerichtsjahr from './AnzMassnBerichtsjahr'
import AnzMassnProPop from './AnzMassnProPop'
import AnzKontrProPop from './AnzKontrProPop'
import Berichte from './Berichte'
import LetzterPopBericht from './LetzterPopBericht'
import LetzterMassnBericht from './LetzterMassnBericht'
import LetzteZaehlung from './LetzteZaehlung'
import LetzteZaehlungInklAnpflanz from './LetzteZaehlungInklAnpflanz'

const PopulationenExports = ({ treeName }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={() => setExpanded(!expanded)}>
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
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {expanded ? (
          <StyledCardContent>
            <Pops treeName={treeName} />
            <Pops treeName={treeName} filtered={true} />
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
        ) : null}
      </Collapse>
    </StyledCard>
  )
}

export default PopulationenExports
