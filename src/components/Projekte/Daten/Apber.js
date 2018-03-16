// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import AutoComplete from '../../shared/Autocomplete'
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
  overflow: auto !important;
  padding: 10px;
  column-width: ${props =>
    props.width > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const getBearbName = ({ store, tree }: { store: Object, tree: Object }) => {
  const { adressen } = store.dropdownList
  const { activeDataset } = tree
  let name = ''
  if (activeDataset.row.JBerBearb && adressen.length > 0) {
    const adresse = adressen.find(a => a.AdrId === activeDataset.row.JBerBearb)
    if (adresse && adresse.AdrName) return adresse.AdrName
  }
  return name
}

const enhance = compose(inject('store'), observer)

const Apber = ({
  store,
  tree,
  dimensions,
}: {
  store: Object,
  tree: Object,
  dimensions: Object,
}) => {
  const { activeDataset } = tree
  const veraenGegenVorjahrWerte = [
    { value: '+', label: '+' },
    { value: '-', label: '-' },
  ]
  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  return (
    <ErrorBoundary>
      <Container innerRef={c => (this.container = c)}>
        <FormTitle tree={tree} title="AP-Bericht" />
        <FieldsContainer width={width}>
          <TextField
            key={`${activeDataset.row.JBerId}JBerJahr`}
            tree={tree}
            label="Jahr"
            fieldName="JBerJahr"
            value={activeDataset.row.JBerJahr}
            errorText={activeDataset.valid.JBerJahr}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.JBerId}JBerVergleichVorjahrGesamtziel`}
            tree={tree}
            label="Vergleich Vorjahr - Gesamtziel"
            fieldName="JBerVergleichVorjahrGesamtziel"
            value={activeDataset.row.JBerVergleichVorjahrGesamtziel}
            errorText={activeDataset.valid.JBerVergleichVorjahrGesamtziel}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroup
            tree={tree}
            fieldName="JBerBeurteilung"
            value={activeDataset.row.JBerBeurteilung}
            label="Beurteilung"
            errorText={activeDataset.valid.JBerBeurteilung}
            dataSource={store.dropdownList.apErfkritWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroup
            tree={tree}
            fieldName="JBerVeraenGegenVorjahr"
            value={activeDataset.row.JBerVeraenGegenVorjahr}
            label="Veränderung zum Vorjahr"
            errorText={activeDataset.valid.JBerVeraenGegenVorjahr}
            dataSource={veraenGegenVorjahrWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.JBerId}JBerAnalyse`}
            tree={tree}
            label="Analyse"
            fieldName="JBerAnalyse"
            value={activeDataset.row.JBerAnalyse}
            errorText={activeDataset.valid.JBerAnalyse}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.JBerId}JBerUmsetzung`}
            tree={tree}
            label="Konsequenzen für die Umsetzung"
            fieldName="JBerUmsetzung"
            value={activeDataset.row.JBerUmsetzung}
            errorText={activeDataset.valid.JBerUmsetzung}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.JBerId}JBerErfko`}
            tree={tree}
            label="Konsequenzen für die Erfolgskontrolle"
            fieldName="JBerErfko"
            value={activeDataset.row.JBerErfko}
            errorText={activeDataset.valid.JBerErfko}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.JBerId}JBerATxt`}
            tree={tree}
            label="A. Grundmengen: Bemerkungen/Folgerungen für nächstes Jahr: neue Biotope"
            fieldName="JBerATxt"
            value={activeDataset.row.JBerATxt}
            errorText={activeDataset.valid.JBerATxt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.JBerId}JBerBTxt`}
            tree={tree}
            label="B. Bestandesentwicklung: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Biotope"
            fieldName="JBerBTxt"
            value={activeDataset.row.JBerBTxt}
            errorText={activeDataset.valid.JBerBTxt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.JBerId}JBerCAktivApbearb`}
            tree={tree}
            label="C. Zwischenbilanz zur Wirkung von Massnahmen: Weitere Aktivitäten der Aktionsplan-Verantwortlichen"
            fieldName="JBerCAktivApbearb"
            value={activeDataset.row.JBerCAktivApbearb}
            errorText={activeDataset.valid.JBerCAktivApbearb}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.JBerId}JBerCVerglAusfPl`}
            tree={tree}
            label="C. Zwischenbilanz zur Wirkung von Massnahmen: Vergleich Ausführung/Planung"
            fieldName="JBerCVerglAusfPl"
            value={activeDataset.row.JBerCVerglAusfPl}
            errorText={activeDataset.valid.JBerCVerglAusfPl}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.JBerId}JBerCTxt`}
            tree={tree}
            label="C. Zwischenbilanz zur Wirkung von Massnahmen: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Massnahmen"
            fieldName="JBerCTxt"
            value={activeDataset.row.JBerCTxt}
            errorText={activeDataset.valid.JBerCTxt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.JBerId}JBerDTxt`}
            tree={tree}
            label="D. Einschätzung der Wirkung des AP insgesamt auf die Art: Bemerkungen"
            fieldName="JBerDTxt"
            value={activeDataset.row.JBerDTxt}
            errorText={activeDataset.valid.JBerDTxt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <DateFieldWithPicker
            key={`${activeDataset.row.JBerId}JBerDatum`}
            tree={tree}
            label="Datum"
            fieldName="JBerDatum"
            value={activeDataset.row.JBerDatum}
            errorText={activeDataset.valid.JBerDatum}
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <AutoComplete
            key={`${activeDataset.row.JBerId}JBerBearb`}
            tree={tree}
            label="BearbeiterIn"
            fieldName="JBerBearb"
            valueText={getBearbName({ store, tree })}
            errorText={activeDataset.valid.JBerBearb}
            dataSource={store.dropdownList.adressen}
            dataSourceConfig={{
              value: 'AdrId',
              text: 'AdrName',
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            targetOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Apber)
