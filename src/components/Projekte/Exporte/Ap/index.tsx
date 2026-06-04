import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { Ap as ApComponent } from './Ap.tsx'
import { ApOhnePop } from './ApOhnePop.tsx'
import { AnzMassn } from './AnzMassn.tsx'
import { AnzKontr } from './AnzKontr.tsx'
import { Ber } from './Ber.tsx'
import { BerUndMassn } from './BerUndMassn.tsx'
import { PriorisierungFuerEk } from './PriorisierungFuerEk.tsx'
import { EkPlanung } from './EkPlanung.tsx'
import { Ziele } from './Ziele.tsx'
import { Erfkrit } from './Erfkrit.tsx'
import { Idealbiotop } from './Idealbiotop.tsx'
import { Assozart } from './Assozart.tsx'

import styles from '../index.module.css'

export const Ap = () => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = () => setExpanded(!expanded)

  return (
    <Card className={styles.card}>
      <CardActions
        className={styles.cardActions}
        disableSpacing
        onClick={onClickAction}
      >
        <div className={styles.actionTitle}>Art</div>
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
            <Erfkrit />
            <Idealbiotop />
            <Assozart />
          </CardContent>
        : null}
      </Collapse>
    </Card>
  )
}
