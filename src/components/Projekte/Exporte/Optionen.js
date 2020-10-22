import React, { useContext, useState } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'

const StyledCard = styled(Card)`
  margin: 10px 0;
  background-color: #fff8e1 !important;
`
const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  height: auto !important;
`
const CardActionIconButton = styled(IconButton)`
  transform: ${(props) => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
  user-select: none;
`
const StyledCardContent = styled(CardContent)`
  margin: -15px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
`
const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0 !important;
`
const StyledCheckbox = styled(Checkbox)`
  width: 30px !important;
  height: 30px !important;
`

const Optionen = () => {
  const {
    mapFilter: mapFilterRaw,
    setExportFileType,
    setExportApplyMapFilter,
    exportApplyMapFilter,
    exportFileType,
  } = useContext(storeContext)
  const mapFilter = mapFilterRaw.toJSON()
  const [expanded, setExpanded] = useState(true)

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
          <StyledFormControlLabel
            control={
              <StyledCheckbox
                checked={exportApplyMapFilter}
                onChange={() => setExportApplyMapFilter(!exportApplyMapFilter)}
                value={exportApplyMapFilter.toString()}
                color="primary"
              />
            }
            label={
              mapFilter.features.length > 0
                ? 'Karten-Filter anwenden'
                : 'Karten-Filter anwenden (verfügbar, wenn ein Karten-Filter erstellt wurde)'
            }
            disabled={!(mapFilter.features.length > 0)}
          />
        </StyledCardContent>
      </Collapse>
    </StyledCard>
  )
}

export default observer(Optionen)
