// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import TextField from '../../shared/TextField'
import DateFieldWithPicker from '../../shared/DateFieldWithPicker'
import FormTitle from '../../shared/FormTitle'
import constants from '../../../modules/constants'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`
const Section = styled.div`
  padding-top: 20px;
  margin-bottom: -7px;
  color: rgba(255, 255, 255, 0.298039);
  font-weight: bold;
  &:after {
    content: ':';
  }
`

const enhance = compose(inject('store'), observer)

const Idealbiotop = ({
  store,
  tree,
  dimensions = { width: 380 },
}: {
  store: Object,
  tree: Object,
  dimensions: Object,
}) => {
  const { activeDataset } = tree
  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  return (
    <ErrorBoundary>
      <Container innerRef={c => (this.container = c)}>
        <FormTitle tree={tree} title="Idealbiotop" />
        <FieldsContainer data-width={width}>
          <DateFieldWithPicker
            key={`${activeDataset.row.id}erstelldatum`}
            tree={tree}
            label="Erstelldatum"
            fieldName="erstelldatum"
            value={activeDataset.row.erstelldatum}
            errorText={activeDataset.valid.erstelldatum}
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <Section>Lage</Section>
          <TextField
            key={`${activeDataset.row.id}hoehenlage`}
            tree={tree}
            label="Höhe"
            fieldName="hoehenlage"
            value={activeDataset.row.hoehenlage}
            errorText={activeDataset.valid.hoehenlage}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}region`}
            tree={tree}
            label="Region"
            fieldName="region"
            value={activeDataset.row.region}
            errorText={activeDataset.valid.region}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}exposition`}
            tree={tree}
            label="Exposition"
            fieldName="exposition"
            value={activeDataset.row.exposition}
            errorText={activeDataset.valid.exposition}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}besonnung`}
            tree={tree}
            label="Besonnung"
            fieldName="besonnung"
            value={activeDataset.row.besonnung}
            errorText={activeDataset.valid.besonnung}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}hangneigung`}
            tree={tree}
            label="Hangneigung"
            fieldName="hangneigung"
            value={activeDataset.row.hangneigung}
            errorText={activeDataset.valid.hangneigung}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <Section>Boden</Section>
          <TextField
            key={`${activeDataset.row.id}boden_typ`}
            tree={tree}
            label="Typ"
            fieldName="boden_typ"
            value={activeDataset.row.boden_typ}
            errorText={activeDataset.valid.boden_typ}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}boden_kalkgehalt`}
            tree={tree}
            label="Kalkgehalt"
            fieldName="boden_kalkgehalt"
            value={activeDataset.row.boden_kalkgehalt}
            errorText={activeDataset.valid.boden_kalkgehalt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}boden_durchlaessigkeit`}
            tree={tree}
            label="Durchlässigkeit"
            fieldName="boden_durchlaessigkeit"
            value={activeDataset.row.boden_durchlaessigkeit}
            errorText={activeDataset.valid.boden_durchlaessigkeit}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}boden_humus`}
            tree={tree}
            label="Humus"
            fieldName="boden_humus"
            value={activeDataset.row.boden_humus}
            errorText={activeDataset.valid.boden_humus}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}boden_naehrstoffgehalt`}
            tree={tree}
            label="Nährstoffgehalt"
            fieldName="boden_naehrstoffgehalt"
            value={activeDataset.row.boden_naehrstoffgehalt}
            errorText={activeDataset.valid.boden_naehrstoffgehalt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}wasserhaushalt`}
            tree={tree}
            label="Wasserhaushalt"
            fieldName="wasserhaushalt"
            value={activeDataset.row.wasserhaushalt}
            errorText={activeDataset.valid.wasserhaushalt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <Section>Vegetation</Section>
          <TextField
            key={`${activeDataset.row.id}konkurrenz`}
            tree={tree}
            label="Konkurrenz"
            fieldName="konkurrenz"
            value={activeDataset.row.konkurrenz}
            errorText={activeDataset.valid.konkurrenz}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}moosschicht`}
            tree={tree}
            label="Moosschicht"
            fieldName="moosschicht"
            value={activeDataset.row.moosschicht}
            errorText={activeDataset.valid.moosschicht}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}Krautschicht`}
            tree={tree}
            label="Krautschicht"
            fieldName="krautschicht"
            value={activeDataset.row.krautschicht}
            errorText={activeDataset.valid.krautschicht}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}Strauchschicht`}
            tree={tree}
            label="Strauchschicht"
            fieldName="strauchschicht"
            value={activeDataset.row.strauchschicht}
            errorText={activeDataset.valid.strauchschicht}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}baumschicht`}
            tree={tree}
            label="Baumschicht"
            fieldName="baumschicht"
            value={activeDataset.row.baumschicht}
            errorText={activeDataset.valid.baumschicht}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}bemerkungen`}
            tree={tree}
            label="Bemerkungen"
            fieldName="bemerkungen"
            value={activeDataset.row.bemerkungen}
            errorText={activeDataset.valid.bemerkungen}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Idealbiotop)
