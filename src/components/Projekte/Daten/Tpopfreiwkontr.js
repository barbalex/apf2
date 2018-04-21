// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButton from '../../shared/RadioButton'
import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import AutoCompleteNew from '../../shared/AutocompleteNew'
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
const jungpflanzenVorhandenDataSource = [
  { value: 1, label: 'ja' },
  { value: 0, label: 'nein' },
]

const Tpopfreiwkontr = ({
  store,
  tree,
  dimensions = { width: 380 },
}: {
  store: Object,
  tree: Object,
  dimensions: number,
}) => {
  const { activeDataset } = tree
  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  return (
    <ErrorBoundary>
      <Container innerRef={c => (this.container = c)}>
        <FormTitle tree={tree} title="Freiwilligen-Kontrolle" />
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
          <AutoCompleteNew
            key={`${activeDataset.row.id}bearbeiter`}
            tree={tree}
            label="BearbeiterIn"
            fieldName="bearbeiter"
            value={getBearbName({ store, tree })}
            objects={store.dropdownList.adressen}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButton
            tree={tree}
            fieldName="plan_vorhanden"
            label="Auf Plan eingezeichnet"
            value={activeDataset.row.plan_vorhanden}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}flaeche_ueberprueft`}
            tree={tree}
            label="Überprüfte Fläche in m2"
            fieldName="flaeche_ueberprueft"
            value={activeDataset.row.flaeche_ueberprueft}
            errorText={activeDataset.valid.flaeche_ueberprueft}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}deckung_ap_art`}
            tree={tree}
            label="Deckung überprüfte Art (%)"
            fieldName="deckung_ap_art"
            value={activeDataset.row.deckung_ap_art}
            errorText={activeDataset.valid.deckung_ap_art}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}deckung_nackter_boden`}
            tree={tree}
            label="Deckung nackter Boden (%)"
            fieldName="deckung_nackter_boden"
            value={activeDataset.row.deckung_nackter_boden}
            errorText={activeDataset.valid.deckung_nackter_boden}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroup
            tree={tree}
            fieldName="jungpflanzen_vorhanden"
            label="Auch junge Pflanzen vorhanden"
            value={activeDataset.row.jungpflanzen_vorhanden}
            dataSource={jungpflanzenVorhandenDataSource}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}vegetationshoehe_maximum`}
            tree={tree}
            label="Maximum der Vegetationshöhe in cm"
            fieldName="vegetationshoehe_maximum"
            value={activeDataset.row.vegetationshoehe_maximum}
            errorText={activeDataset.valid.vegetationshoehe_maximum}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}vegetationshoehe_mittel`}
            tree={tree}
            label="Mittelwert der Vegetationshöhe in cm"
            fieldName="vegetationshoehe_mittel"
            value={activeDataset.row.vegetationshoehe_mittel}
            errorText={activeDataset.valid.vegetationshoehe_mittel}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}gefaehrdung`}
            tree={tree}
            label="Gefährdung"
            fieldName="gefaehrdung"
            value={activeDataset.row.gefaehrdung}
            errorText={activeDataset.valid.gefaehrdung}
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
          <StringToCopy text={activeDataset.row.id} label="GUID" />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpopfreiwkontr)
