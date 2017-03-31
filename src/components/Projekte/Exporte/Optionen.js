import React, { PropTypes } from 'react'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import Checkbox from 'material-ui/Checkbox'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'

const FirstLevelCard = styled(Card)`
  margin-bottom: 10px;
`

const enhance = compose(
  inject(`store`),
  observer
)

const Optionen = ({ store }) =>
  <FirstLevelCard initiallyExpanded>
    <CardHeader
      title="Optionen"
      actAsExpander
      showExpandableButton
    />
    <CardText
      expandable
    >
      <Checkbox
        label={
          (
            store.map.mapFilter.filter.features.length > 0 ?
            `Karten-Filter anwenden` :
            `Karten-Filter anwenden (verfügbar, wenn ein Karten-Filter erstellt wurde)`
          )
        }
        value={store.map.applyMapFilterToExport}
        checked={store.map.applyMapFilterToExport}
        onCheck={store.map.toggleApplyMapFilterToExport}
        disabled={!(store.map.mapFilter.filter.features.length > 0)}
      />
      {
        false &&
        <Checkbox
          label={`Strukturbaum-Filter anwenden`}
          value={store.node.applyNodeLabelFilterToExport}
          checked={store.node.applyNodeLabelFilterToExport}
          onCheck={store.node.toggleApplyNodeLabelFilterToExport}
          disabled
        />
      }
      {
        false &&
        <Checkbox
          label={`Nach den aktuell im Strukturbaum gewählten Elementen filtern`}
          value={store.node.applyActiveNodeFilterToExport}
          checked={store.node.applyActiveNodeFilterToExport}
          onCheck={store.node.toggleApplyActiveNodeFilterToExport}
          disabled
        />
      }
    </CardText>
  </FirstLevelCard>

Optionen.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Optionen)
