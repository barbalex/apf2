// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import AutoCompleteNew from '../../shared/AutocompleteNew'
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
  height: 100%;
  column-width: ${props =>
    props.width > 2 * constants.columnWidth
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

const Apber = ({
  store,
  tree,
  dimensions = { width: 380 },
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
            key={`${activeDataset.row.id}jahr`}
            tree={tree}
            label="Jahr"
            fieldName="jahr"
            value={activeDataset.row.jahr}
            errorText={activeDataset.valid.jahr}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}vergleich_vorjahr_gesamtziel`}
            tree={tree}
            label="Vergleich Vorjahr - Gesamtziel"
            fieldName="vergleich_vorjahr_gesamtziel"
            value={activeDataset.row.vergleich_vorjahr_gesamtziel}
            errorText={activeDataset.valid.vergleich_vorjahr_gesamtziel}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroup
            tree={tree}
            fieldName="beurteilung"
            value={activeDataset.row.beurteilung}
            label="Beurteilung"
            errorText={activeDataset.valid.beurteilung}
            dataSource={store.dropdownList.apErfkritWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroup
            tree={tree}
            fieldName="veraenderung_zum_vorjahr"
            value={activeDataset.row.veraenderung_zum_vorjahr}
            label="Veränderung zum Vorjahr"
            errorText={activeDataset.valid.veraenderung_zum_vorjahr}
            dataSource={veraenGegenVorjahrWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}apber_analyse`}
            tree={tree}
            label="Analyse"
            fieldName="apber_analyse"
            value={activeDataset.row.apber_analyse}
            errorText={activeDataset.valid.apber_analyse}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}konsequenzen_umsetzung`}
            tree={tree}
            label="Konsequenzen für die Umsetzung"
            fieldName="konsequenzen_umsetzung"
            value={activeDataset.row.konsequenzen_umsetzung}
            errorText={activeDataset.valid.konsequenzen_umsetzung}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}konsequenzen_erfolgskontrolle`}
            tree={tree}
            label="Konsequenzen für die Erfolgskontrolle"
            fieldName="konsequenzen_erfolgskontrolle"
            value={activeDataset.row.konsequenzen_erfolgskontrolle}
            errorText={activeDataset.valid.konsequenzen_erfolgskontrolle}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}biotope_neue`}
            tree={tree}
            label="A. Grundmengen: Bemerkungen/Folgerungen für nächstes Jahr: neue Biotope"
            fieldName="biotope_neue"
            value={activeDataset.row.biotope_neue}
            errorText={activeDataset.valid.biotope_neue}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}biotope_optimieren`}
            tree={tree}
            label="B. Bestandesentwicklung: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Biotope"
            fieldName="biotope_optimieren"
            value={activeDataset.row.biotope_optimieren}
            errorText={activeDataset.valid.biotope_optimieren}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}massnahmen_ap_bearb`}
            tree={tree}
            label="C. Zwischenbilanz zur Wirkung von Massnahmen: Weitere Aktivitäten der Aktionsplan-Verantwortlichen"
            fieldName="massnahmen_ap_bearb"
            value={activeDataset.row.massnahmen_ap_bearb}
            errorText={activeDataset.valid.massnahmen_ap_bearb}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}massnahmen_planung_vs_ausfuehrung`}
            tree={tree}
            label="C. Zwischenbilanz zur Wirkung von Massnahmen: Vergleich Ausführung/Planung"
            fieldName="massnahmen_planung_vs_ausfuehrung"
            value={activeDataset.row.massnahmen_planung_vs_ausfuehrung}
            errorText={activeDataset.valid.massnahmen_planung_vs_ausfuehrung}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}massnahmen_optimieren`}
            tree={tree}
            label="C. Zwischenbilanz zur Wirkung von Massnahmen: Bemerkungen/Folgerungen für nächstes Jahr: Optimierung Massnahmen"
            fieldName="massnahmen_optimieren"
            value={activeDataset.row.massnahmen_optimieren}
            errorText={activeDataset.valid.massnahmen_optimieren}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}wirkung_auf_art`}
            tree={tree}
            label="D. Einschätzung der Wirkung des AP insgesamt auf die Art: Bemerkungen"
            fieldName="wirkung_auf_art"
            value={activeDataset.row.wirkung_auf_art}
            errorText={activeDataset.valid.wirkung_auf_art}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <DateFieldWithPicker
            key={`${activeDataset.row.id}datum`}
            tree={tree}
            label="Datum"
            fieldName="datum"
            value={activeDataset.row.datum}
            errorText={activeDataset.valid.datum}
            fullWidth
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
            openabove
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Apber)
