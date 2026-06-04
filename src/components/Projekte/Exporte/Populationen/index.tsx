import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { Pops } from './Pops.tsx'
import { PopsForGoogleEarth } from './PopsForGoogleEarth.tsx'
import { PopsForGEArtname } from './PopsForGEArtname.tsx'
import { ApOhneStatus } from './ApOhneStatus.tsx'
import { OhneKoord } from './OhneKoord.tsx'
import { AnzMassnBerichtsjahr } from './AnzMassnBerichtsjahr.tsx'
import { AnzMassnProPop } from './AnzMassnProPop.tsx'
import { AnzKontrProPop } from './AnzKontrProPop.tsx'
import { Berichte } from './Berichte.tsx'
import { LetzterPopBericht } from './LetzterPopBericht.tsx'
import { LetzterMassnBericht } from './LetzterMassnBericht.tsx'
import { LetzteZaehlung } from './LetzteZaehlung.tsx'
import { LetzteZaehlungInklAnpflanz } from './LetzteZaehlungInklAnpflanz.tsx'

import styles from '../index.module.css'

export const Populationen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={styles.card}>
      <CardActions
        className={styles.cardActions}
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={styles.actionTitle}>Populationen</div>
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
          <CardContent className={styles.cardContent}>
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
