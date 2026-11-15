import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { Massnahmen as MassnahmenComponent } from './Massnahmen.tsx'
import { MassnWebgisBun } from './MassnWebgisBun.tsx'

import styles from '../index.module.css'
import { useExporteExpanded } from '../useExporteExpanded.ts'

export const Massnahmen = () => {
  const [expanded, setExpanded] = useExporteExpanded('massnahmen')

  return (
    <Card className={styles.card}>
      <CardActions
        className={styles.cardActions}
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={styles.actionTitle}>Massnahmen</div>
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
            <MassnahmenComponent />
            <MassnahmenComponent filtered={true} />
            <MassnWebgisBun />
          </CardContent>
        : null}
      </Collapse>
    </Card>
  )
}
