// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import AutoCompleteFromArrayNew from '../../shared/AutocompleteFromArray'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import AutoCompleteNew from '../../shared/AutocompleteNew'
import RadioButton from '../../shared/RadioButton'
import StringToCopy from '../../shared/StringToCopy'
import FormTitle from '../../shared/FormTitle'
import YearDatePair from '../../shared/YearDatePair'
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
  height: 100%;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const getBearbName = ({ store, tree }: { store: Object, tree: Object }) => {
  const { adressen } = store.dropdownList
  const { activeDataset } = tree
  let value = ''
  if (activeDataset.row.bearbeiter && adressen.length > 0) {
    const adresse = adressen.find(a => a.id === activeDataset.row.bearbeiter)
    if (adresse && adresse.value) return adresse.value
  }
  return value
}

const enhance = compose(inject('store'), observer)

const Tpopmassn = ({
  store,
  tree,
  onNewRequestWirtspflanze,
  onBlurWirtspflanze,
  dimensions = { width: 380 },
}: {
  store: Object,
  tree: Object,
  onNewRequestWirtspflanze: () => void,
  onBlurWirtspflanze: () => void,
  dimensions: number,
}) => {
  const { activeDataset } = tree
  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  return (
    <ErrorBoundary>
      <Container innerRef={c => (this.container = c)}>
        <FormTitle tree={tree} title="Massnahme" />
        <FieldsContainer data-width={width}>
          <YearDatePair
            key={activeDataset.row.id}
            tree={tree}
            yearLabel="Jahr"
            yearFieldName="jahr"
            yearValue={activeDataset.row.jahr}
            yearErrorText={activeDataset.valid.jahr}
            dateLabel="Datum"
            dateFieldName="datum"
            dateValue={activeDataset.row.datum}
            dateErrorText={activeDataset.valid.datum}
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroup
            tree={tree}
            fieldName="typ"
            label="Typ"
            value={activeDataset.row.typ}
            errorText={activeDataset.valid.typ}
            dataSource={store.dropdownList.tpopMassnTypWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}beschreibung`}
            tree={tree}
            label="Massnahme"
            fieldName="beschreibung"
            value={activeDataset.row.beschreibung}
            errorText={activeDataset.valid.beschreibung}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <AutoCompleteNew
            key={`${activeDataset.row.id}bearbeiter`}
            tree={tree}
            label="BearbeiterIn"
            fieldName="bearbeiter"
            value={getBearbName({ store, tree })}
            objects={store.dropdownList.adressen}
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
          <RadioButton
            tree={tree}
            fieldName="plan_vorhanden"
            label="Plan vorhanden"
            value={activeDataset.row.plan_vorhanden}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}plan_bezeichnung`}
            tree={tree}
            label="Plan Bezeichnung"
            fieldName="plan_bezeichnung"
            value={activeDataset.row.plan_bezeichnung}
            errorText={activeDataset.valid.plan_bezeichnung}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}flaeche`}
            tree={tree}
            label="Fläche (m2)"
            fieldName="flaeche"
            value={activeDataset.row.flaeche}
            errorText={activeDataset.valid.flaeche}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}form`}
            tree={tree}
            label="Form der Ansiedlung"
            fieldName="form"
            value={activeDataset.row.form}
            errorText={activeDataset.valid.form}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}pflanzanordnung`}
            tree={tree}
            label="Pflanzanordnung"
            fieldName="pflanzanordnung"
            value={activeDataset.row.pflanzanordnung}
            errorText={activeDataset.valid.pflanzanordnung}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}markierung`}
            tree={tree}
            label="Markierung"
            fieldName="markierung"
            value={activeDataset.row.markierung}
            errorText={activeDataset.valid.markierung}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}anz_triebe`}
            tree={tree}
            label="Anzahl Triebe"
            fieldName="anz_triebe"
            value={activeDataset.row.anz_triebe}
            errorText={activeDataset.valid.anz_triebe}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}anz_pflanzen`}
            tree={tree}
            label="Anzahl Pflanzen"
            fieldName="anz_pflanzen"
            value={activeDataset.row.anz_pflanzen}
            errorText={activeDataset.valid.anz_pflanzen}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}anz_pflanzstellen`}
            tree={tree}
            label="Anzahl Pflanzstellen"
            fieldName="anz_pflanzstellen"
            value={activeDataset.row.anz_pflanzstellen}
            errorText={activeDataset.valid.anz_pflanzstellen}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <AutoCompleteFromArrayNew
            key={`${activeDataset.row.id}wirtspflanzeNeu`}
            tree={tree}
            label="Wirtspflanze"
            fieldName="wirtspflanze"
            value={activeDataset.row.wirtspflanze}
            errorText={activeDataset.valid.wirtspflanze}
            values={store.dropdownList.artnamen}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}herkunft_pop`}
            tree={tree}
            label="Herkunftspopulation"
            fieldName="herkunft_pop"
            value={activeDataset.row.herkunft_pop}
            errorText={activeDataset.valid.herkunft_pop}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}sammeldatum`}
            tree={tree}
            label="Sammeldatum"
            fieldName="sammeldatum"
            value={activeDataset.row.sammeldatum}
            errorText={activeDataset.valid.sammeldatum}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <StringToCopy text={activeDataset.row.id} label="id" />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpopmassn)
