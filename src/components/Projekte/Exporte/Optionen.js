import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import Checkbox from 'material-ui/Checkbox'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'

const FirstLevelCard = styled(Card)`
  margin-bottom: 10px;
`

const enhance = compose(inject('store'), observer)

const Optionen = ({ store }: { store: Object }) => (
  <FirstLevelCard initiallyExpanded>
    <CardHeader title="Optionen" actAsExpander showExpandableButton />
    <CardText expandable>
      <Checkbox
        label={
          store.map.mapFilter.filter.features.length > 0
            ? 'Karten-Filter anwenden'
            : 'Karten-Filter anwenden (verfügbar, wenn ein Karten-Filter erstellt wurde)'
        }
        value={store.export.applyMapFilterToExport}
        checked={store.export.applyMapFilterToExport}
        onCheck={store.export.toggleApplyMapFilterToExport}
        disabled={!(store.map.mapFilter.filter.features.length > 0)}
      />
      {false &&
        <Checkbox
          label={'Strukturbaum-Filter anwenden'}
          value={store.export.applyNodeLabelFilterToExport}
          checked={store.export.applyNodeLabelFilterToExport}
          onCheck={store.export.toggleApplyNodeLabelFilterToExport}
          disabled
        />}
      {false &&
        <Checkbox
          label={'Nach den aktuell im Strukturbaum gewählten Elementen filtern'}
          value={store.export.applyActiveNodeFilterToExport}
          checked={store.export.applyActiveNodeFilterToExport}
          onCheck={store.export.toggleApplyActiveNodeFilterToExport}
          disabled
        />}
    </CardText>
  </FirstLevelCard>
)

export default enhance(Optionen)
