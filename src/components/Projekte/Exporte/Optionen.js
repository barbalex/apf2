// @flow
import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import { FormControlLabel } from 'material-ui-next/Form'
import Checkbox from 'material-ui-next/Checkbox'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'

const FirstLevelCard = styled(Card)`
  margin-bottom: 10px;
  background-color: #fff8e1 !important;
`
const StyledCardText = styled(CardText)`
  padding-top: 5px !important;
`
const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0 !important;
`
const StyledCheckbox = styled(Checkbox)`
  width: 30px !important;
  height: 30px !important;
`

const enhance = compose(inject('store'), observer)

const Optionen = ({ store }: { store: Object }) => (
  <FirstLevelCard initiallyExpanded>
    <CardHeader title="Optionen" actAsExpander showExpandableButton />
    <StyledCardText expandable>
      <StyledFormControlLabel
        control={
          <StyledCheckbox
            checked={store.export.fileType === 'csv'}
            onChange={store.export.toggleFileType}
            value={store.export.fileType}
            color="primary"
          />
        }
        label="Dateien im .csv-Format exportieren (Standard ist das xlsx-Format von Excel)"
      />
      <StyledFormControlLabel
        control={
          <StyledCheckbox
            checked={store.export.applyMapFilterToExport}
            onChange={store.export.toggleApplyMapFilterToExport}
            value={store.export.applyMapFilterToExport}
            color="primary"
          />
        }
        label={
          store.map.mapFilter.filter.features.length > 0
            ? 'Karten-Filter anwenden'
            : 'Karten-Filter anwenden (verfügbar, wenn ein Karten-Filter erstellt wurde)'
        }
        disabled={!(store.map.mapFilter.filter.features.length > 0)}
      />
    </StyledCardText>
  </FirstLevelCard>
)

export default enhance(Optionen)
