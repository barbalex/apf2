import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { Kontrollen as KontrollenComponent } from './Kontrollen.tsx'
import { KontrFuerWebgisBun } from './KontrFuerWebgisBun.tsx'
import { KontrAnzProZaehlEinheit } from './KontrAnzProZaehlEinheit.tsx'
import { InfoFlora } from './InfoFlora.tsx'

import styles from '../index.module.css'

export const Kontrollen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={styles.card}>
      <CardActions
        className={styles.cardActions}
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={styles.actionTitle}>Kontrollen</div>
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
            <KontrollenComponent />
            <KontrollenComponent filtered={true} />
            <KontrFuerWebgisBun />
            <KontrAnzProZaehlEinheit />
            <InfoFlora />
          </CardContent>
        : null}
      </Collapse>
    </Card>
  )
}
