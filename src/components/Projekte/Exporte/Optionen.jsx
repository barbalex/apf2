import { useContext, useState } from 'react'
import Collapse from '@mui/material/Collapse'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../mobxContext.js'

import { formControlLabel, checkbox } from './Optionen.module.css'
import { CardActionIconButton } from './index.jsx'
import { cardContent, actionTitle, card, cardActions } from './index.module.css'

export const Optionen = observer(() => {
  const store = useContext(MobxContext)
  const { setExportFileType, exportFileType } = store
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={card}>
      <CardActions
        className={cardActions}
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={actionTitle}>Optionen</div>
        <Tooltip title={expanded ? 'schliessen' : 'öffnen'}>
          <CardActionIconButton
            data-expanded={expanded}
            aria-expanded={expanded}
            aria-label={expanded ? 'schliessen' : 'öffnen'}
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
        <CardContent className={cardContent}>
          <FormControlLabel
            control={
              <Checkbox
                checked={exportFileType === 'csv'}
                onChange={() =>
                  setExportFileType(exportFileType === 'csv' ? 'xlsx' : 'csv')
                }
                value={exportFileType}
                color="primary"
                className={checkbox}
              />
            }
            label="Dateien im .csv-Format exportieren (Standard ist das xlsx-Format von Excel)"
            className={formControlLabel}
          />
        </CardContent>
      </Collapse>
    </Card>
  )
})
