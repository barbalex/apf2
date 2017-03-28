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
        label={`Karten-Filter anwenden`}
        value={store.node.applyMapFilterToExport}
        checked={store.node.applyMapFilterToExport}
        onCheck={store.node.toggleApplyMapFilterToExport}
      />
      <Checkbox
        label={`Strukturbaum-Filter anwenden`}
        value={store.node.applyNodeLabelFilterToExport}
        checked={store.node.applyNodeLabelFilterToExport}
        onCheck={store.node.toggleApplyNodeLabelFilterToExport}
      />
      <Checkbox
        label={`Nach den aktuell im Strukturbaum gewählten Elementen filtern`}
        value={store.node.applyActiveNodeFilterToExport}
        checked={store.node.applyActiveNodeFilterToExport}
        onCheck={store.node.toggleApplyActiveNodeFilterToExport}
      />
    </CardText>
  </FirstLevelCard>

Optionen.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Optionen)
