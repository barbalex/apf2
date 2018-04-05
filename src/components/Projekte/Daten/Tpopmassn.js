// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import AutoCompleteFromArray from '../../shared/AutocompleteFromArray'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import AutoComplete from '../../shared/Autocomplete'
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
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const getBearbName = ({ store, tree }: { store: Object, tree: Object }) => {
  const { adressen } = store.dropdownList
  const { activeDataset } = tree
  let name = ''
  if (activeDataset.row.TPopMassnBearb && adressen.length > 0) {
    const adresse = adressen.find(
      a => a.AdrId === activeDataset.row.TPopMassnBearb
    )
    if (adresse && adresse.AdrName) return adresse.AdrName
  }
  return name
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
            key={activeDataset.row.TPopMassnId}
            tree={tree}
            yearLabel="Jahr"
            yearFieldName="TPopMassnJahr"
            yearValue={activeDataset.row.TPopMassnJahr}
            yearErrorText={activeDataset.valid.TPopMassnJahr}
            dateLabel="Datum"
            dateFieldName="TPopMassnDatum"
            dateValue={activeDataset.row.TPopMassnDatum}
            dateErrorText={activeDataset.valid.TPopMassnDatum}
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroup
            tree={tree}
            fieldName="TPopMassnTyp"
            label="Typ"
            value={activeDataset.row.TPopMassnTyp}
            errorText={activeDataset.valid.TPopMassnTyp}
            dataSource={store.dropdownList.tpopMassnTypWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.TPopMassnId}TPopMassnTxt`}
            tree={tree}
            label="Massnahme"
            fieldName="TPopMassnTxt"
            value={activeDataset.row.TPopMassnTxt}
            errorText={activeDataset.valid.TPopMassnTxt}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <AutoComplete
            key={`${activeDataset.row.TPopMassnId}TPopMassnBearb`}
            tree={tree}
            label="BearbeiterIn"
            fieldName="TPopMassnBearb"
            valueText={getBearbName({ store, tree })}
            errorText={activeDataset.valid.TPopMassnBearb}
            dataSource={store.dropdownList.adressen}
            dataSourceConfig={{
              value: 'AdrId',
              text: 'AdrName',
            }}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.TPopMassnId}TPopMassnBemTxt`}
            tree={tree}
            label="Bemerkungen"
            fieldName="TPopMassnBemTxt"
            value={activeDataset.row.TPopMassnBemTxt}
            errorText={activeDataset.valid.TPopMassnBemTxt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButton
            tree={tree}
            fieldName="TPopMassnPlan"
            label="Plan vorhanden"
            value={activeDataset.row.TPopMassnPlan}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.TPopMassnId}TPopMassnPlanBez`}
            tree={tree}
            label="Plan Bezeichnung"
            fieldName="TPopMassnPlanBez"
            value={activeDataset.row.TPopMassnPlanBez}
            errorText={activeDataset.valid.TPopMassnPlanBez}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.TPopMassnId}TPopMassnFlaeche`}
            tree={tree}
            label="Fläche (m2)"
            fieldName="TPopMassnFlaeche"
            value={activeDataset.row.TPopMassnFlaeche}
            errorText={activeDataset.valid.TPopMassnFlaeche}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.TPopMassnId}TPopMassnAnsiedForm`}
            tree={tree}
            label="Form der Ansiedlung"
            fieldName="TPopMassnAnsiedForm"
            value={activeDataset.row.TPopMassnAnsiedForm}
            errorText={activeDataset.valid.TPopMassnAnsiedForm}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${
              activeDataset.row.TPopMassnId
            }TPopMassnAnsiedPflanzanordnung`}
            tree={tree}
            label="Pflanzanordnung"
            fieldName="TPopMassnAnsiedPflanzanordnung"
            value={activeDataset.row.TPopMassnAnsiedPflanzanordnung}
            errorText={activeDataset.valid.TPopMassnAnsiedPflanzanordnung}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.TPopMassnId}TPopMassnMarkierung`}
            tree={tree}
            label="Markierung"
            fieldName="TPopMassnMarkierung"
            value={activeDataset.row.TPopMassnMarkierung}
            errorText={activeDataset.valid.TPopMassnMarkierung}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.TPopMassnId}TPopMassnAnsiedAnzTriebe`}
            tree={tree}
            label="Anzahl Triebe"
            fieldName="TPopMassnAnsiedAnzTriebe"
            value={activeDataset.row.TPopMassnAnsiedAnzTriebe}
            errorText={activeDataset.valid.TPopMassnAnsiedAnzTriebe}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.TPopMassnId}TPopMassnAnsiedAnzPfl`}
            tree={tree}
            label="Anzahl Pflanzen"
            fieldName="TPopMassnAnsiedAnzPfl"
            value={activeDataset.row.TPopMassnAnsiedAnzPfl}
            errorText={activeDataset.valid.TPopMassnAnsiedAnzPfl}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.TPopMassnId}TPopMassnAnzPflanzstellen`}
            tree={tree}
            label="Anzahl Pflanzstellen"
            fieldName="TPopMassnAnzPflanzstellen"
            value={activeDataset.row.TPopMassnAnzPflanzstellen}
            errorText={activeDataset.valid.TPopMassnAnzPflanzstellen}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <AutoCompleteFromArray
            key={`${activeDataset.row.TPopMassnId}Wirtspflanze`}
            tree={tree}
            label="Wirtspflanze"
            fieldName="TPopMassnAnsiedWirtspfl"
            valueText={activeDataset.row.TPopMassnAnsiedWirtspfl}
            errorText={activeDataset.valid.TPopMassnAnsiedWirtspfl}
            dataSource={store.dropdownList.artnamen}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.TPopMassnId}TPopMassnAnsiedHerkunftPop`}
            tree={tree}
            label="Herkunftspopulation"
            fieldName="TPopMassnAnsiedHerkunftPop"
            value={activeDataset.row.TPopMassnAnsiedHerkunftPop}
            errorText={activeDataset.valid.TPopMassnAnsiedHerkunftPop}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.TPopMassnId}TPopMassnAnsiedDatSamm`}
            tree={tree}
            label="Sammeldatum"
            fieldName="TPopMassnAnsiedDatSamm"
            value={activeDataset.row.TPopMassnAnsiedDatSamm}
            errorText={activeDataset.valid.TPopMassnAnsiedDatSamm}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <StringToCopy text={activeDataset.row.TPopMassnGuid} label="GUID" />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpopmassn)
