import { memo, useContext, useState } from 'react'
import Collapse from '@mui/material/Collapse'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../storeContext.js'
import {
  StyledCardContent,
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from './index.jsx'

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0 !important;
`
const StyledCheckbox = styled(Checkbox)`
  width: 30px !important;
  height: 30px !important;
`

export const Optionen = memo(
  observer(() => {
    const store = useContext(MobxContext)
    const { setExportFileType, exportFileType } = store
    const [expanded, setExpanded] = useState(false)

    return (
      <StyledCard>
        <StyledCardActions
          disableSpacing
          onClick={() => setExpanded(!expanded)}
        >
          <CardActionTitle>Optionen</CardActionTitle>
          <Tooltip title={expanded ? 'schliessen' : 'öffnen'}>
            <CardActionIconButton
              data-expanded={expanded}
              aria-expanded={expanded}
              aria-label={expanded ? 'schliessen' : 'öffnen'}
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
          <StyledCardContent>
            <StyledFormControlLabel
              control={
                <StyledCheckbox
                  checked={exportFileType === 'csv'}
                  onChange={() =>
                    setExportFileType(exportFileType === 'csv' ? 'xlsx' : 'csv')
                  }
                  value={exportFileType}
                  color="primary"
                />
              }
              label="Dateien im .csv-Format exportieren (Standard ist das xlsx-Format von Excel)"
            />
          </StyledCardContent>
        </Collapse>
      </StyledCard>
    )
  }),
)
