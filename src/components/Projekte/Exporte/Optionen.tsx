import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  exportFileTypeAtom,
  setExportFileTypeAtom,
} from '../../../store/index.ts'

import optionenStyles from './Optionen.module.css'
import styles from './index.module.css'

export const Optionen = () => {
  const exportFileType = useAtomValue(exportFileTypeAtom)
  const setExportFileType = useSetAtom(setExportFileTypeAtom)
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={styles.card}>
      <CardActions
        className={styles.cardActions}
        disableSpacing
        onClick={() => setExpanded(!expanded)}
      >
        <div className={styles.actionTitle}>Optionen</div>
        <Tooltip title={expanded ? 'schliessen' : 'öffnen'}>
          <IconButton
            style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
            aria-expanded={expanded}
            aria-label={expanded ? 'schliessen' : 'öffnen'}
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
        <CardContent className={styles.cardContent}>
          <FormControlLabel
            control={
              <Checkbox
                checked={exportFileType === 'csv'}
                onChange={() =>
                  setExportFileType(exportFileType === 'csv' ? 'xlsx' : 'csv')
                }
                value={exportFileType}
                color="primary"
                className={optionenStyles.checkbox}
              />
            }
            label="Dateien im .csv-Format exportieren (Standard ist das xlsx-Format von Excel)"
            className={optionenStyles.formControlLabel}
          />
        </CardContent>
      </Collapse>
    </Card>
  )
}
