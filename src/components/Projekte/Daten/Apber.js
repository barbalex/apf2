// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import DateFieldWithPicker from '../../shared/DateFieldWithPicker'
import SelectField from '../../shared/SelectField'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
`

const enhance = compose(inject('store'), observer)

const Apber = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree
  const veraenGegenVorjahrWerte = [
    { value: '+', label: '+' },
    { value: '-', label: '-' },
  ]

  return (
    <Container>
      <FormTitle tree={tree} title="AP-Bericht" />
      <FieldsContainer>
        <TextField
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
          tree={tree}
          label="Konsequenzen Umsetzung"
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
          tree={tree}
          label="Konsequenzen Erfolgskontrolle"
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
          tree={tree}
          label="Bemerkungen zum Aussagebereich A (neue Biotope)"
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
          tree={tree}
          label="Bemerkungen zum Aussagebereich B (Optimierung Biotope)"
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
          tree={tree}
          label="Bemerkungen zum Aussagebereich C (Optimierung Massnahmen)"
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
          tree={tree}
          label="Bemerkungen zum Aussagebereich D"
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
          tree={tree}
          label="Datum"
          fieldName="JBerDatum"
          value={activeDataset.row.JBerDatum}
          errorText={activeDataset.valid.JBerDatum}
          fullWidth
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <SelectField
          tree={tree}
          label="BearbeiterIn"
          fieldName="JBerBearb"
          value={activeDataset.row.JBerBearb}
          errorText={activeDataset.valid.JBerBearb}
          dataSource={store.dropdownList.adressen}
          valueProp="AdrId"
          labelProp="AdrName"
          updatePropertyInDb={store.updatePropertyInDb}
        />
      </FieldsContainer>
    </Container>
  )
}

export default enhance(Apber)
