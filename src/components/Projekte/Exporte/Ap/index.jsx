import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import { Ap as ApComponent } from './Ap.jsx'
import { ApOhnePop } from './ApOhnePop.jsx'
import { AnzMassn } from './AnzMassn.jsx'
import { AnzKontr } from './AnzKontr.jsx'
import { Ber } from './Ber.jsx'
import { BerUndMassn } from './BerUndMassn.jsx'
import { PriorisierungFuerEk } from './PriorisierungFuerEk.jsx'
import { EkPlanung } from './EkPlanung.jsx'
import { Ziele } from './Ziele.jsx'
import { Erfkrit } from './Erfkrit.jsx'
import { Idealbiotop } from './Idealbiotop.jsx'
import { Assozart } from './Assozart.jsx'

import { CardActionIconButton } from '../index.jsx'
import {
  cardContent,
  actionTitle,
  card,
  cardActions,
} from '../index.module.css'

export const Ap = () => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = () => setExpanded(!expanded)

  return (
    <Card className={card}>
      <CardActions
        className={cardActions}
        disableSpacing
        onClick={onClickAction}
      >
        <div className={actionTitle}>Art</div>
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
      </CardActions>
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        {expanded ?
          <CardContent className={cardContent}>
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
