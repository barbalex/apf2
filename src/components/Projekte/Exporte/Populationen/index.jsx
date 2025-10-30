import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { Pops } from './Pops.jsx'
import { PopsForGoogleEarth } from './PopsForGoogleEarth.jsx'
import { PopsForGEArtname } from './PopsForGEArtname.jsx'
import { ApOhneStatus } from './ApOhneStatus.jsx'
import { OhneKoord } from './OhneKoord.jsx'
import { AnzMassnBerichtsjahr } from './AnzMassnBerichtsjahr.jsx'
import { AnzMassnProPop } from './AnzMassnProPop.jsx'
import { AnzKontrProPop } from './AnzKontrProPop.jsx'
import { Berichte } from './Berichte.jsx'
import { LetzterPopBericht } from './LetzterPopBericht.jsx'
import { LetzterMassnBericht } from './LetzterMassnBericht.jsx'
import { LetzteZaehlung } from './LetzteZaehlung.jsx'
import { LetzteZaehlungInklAnpflanz } from './LetzteZaehlungInklAnpflanz.jsx'

import {
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index.jsx'
import { cardContent } from '../index.module.css'

export const Populationen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <CardActionTitle>Populationen</CardActionTitle>
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
          </CardContent>
        : null}
      </Collapse>
    </StyledCard>
  )
}
