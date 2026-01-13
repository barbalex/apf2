import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import beziehungen from '../../../etc/beziehungen.png'

import styles from './index.module.css'

export const Anwendung = () => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = () => setExpanded(!expanded)
  const onClickGrafisch = () => window.open(beziehungen)

  return (
    <Card className={styles.card}>
      <CardActions
        className={styles.styles.cardActions}
        disableSpacing
        onClick={onClickAction}
      >
        <div className={styles.actionTitle}>Anwendung</div>
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
            <Button
              className={styles.button}
              onClick={onClickGrafisch}
              color="inherit"
            >
              Datenstruktur grafisch dargestellt
            </Button>
          </CardContent>
        : null}
      </Collapse>
    </Card>
  )
}
