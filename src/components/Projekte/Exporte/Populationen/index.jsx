import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
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
  cardContent,
  actionTitle,
  card,
  cardActions,
} from '../index.module.css'

export const Populationen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={card}>
      <CardActions
        className={cardActions}
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={actionTitle}>Populationen</div>
        <Tooltip title={expanded ? 'schliessen' : 'öffnen'}>
          <IconButton
            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
            aria-expanded={expanded}
            aria-label={expanded ? 'schliessen' : 'öffnen'}
            color="inherit"
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
    </Card>
  )
}
