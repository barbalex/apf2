import React, { useContext, useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'
import {
  StyledCardContent,
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from './index'

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0 !important;
`
const StyledCheckbox = styled(Checkbox)`
  width: 30px !important;
  height: 30px !important;
`

const Optionen = () => {
  const store = useContext(storeContext)
  const { setExportFileType, exportFileType } = store
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={() => setExpanded(!expanded)}>
        <CardActionTitle>Optionen</CardActionTitle>
        <CardActionIconButton
          data-expanded={expanded}
          aria-expanded={expanded}
          aria-label="öffnen"
        >
          <Icon title={expanded ? 'schliessen' : 'öffnen'}>
            <ExpandMoreIcon />
          </Icon>
        </CardActionIconButton>
      </StyledCardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
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
}

export default observer(Optionen)
