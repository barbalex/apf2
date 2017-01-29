// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'

import RadioButton from '../../shared/RadioButton'
import Label from '../../shared/Label'
import TextField from '../../shared/TextField'
import SelectField from '../../shared/SelectField'
import StringToCopy from '../../shared/StringToCopy'
import FormTitle from '../../shared/FormTitle'
import YearDatePair from '../../shared/YearDatePair'

const Container = styled.div`
  height: 100%;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  overflow-x: auto;
  height: 100%;
  padding-bottom: 95px;
`

const enhance = compose(
  inject(`store`),
  withProps((props) => {
    const { store } = props
    const adressen = sortBy(
      Array.from(store.table.adresse.values()),
      `AdrName`
    )
    adressen.unshift({
      id: null,
      AdrName: ``,
    })
    return { adressen }
  }),
  observer
)

const Tpopfreiwkontr = ({
  store,
  adressen,
}) => {
  const { activeDataset } = store
  return (
    <Container>
      <FormTitle title="Freiwilligen-Kontrolle" />
      <FieldsContainer>
        <YearDatePair
          yearLabel="Jahr"
          yearFieldName="TPopKontrJahr"
          yearValue={activeDataset.row.TPopKontrJahr}
          yearErrorText={activeDataset.valid.TPopKontrJahr}
          dateLabel="Datum"
          dateFieldName="TPopKontrDatum"
          dateValue={activeDataset.row.TPopKontrDatum}
          dateErrorText={activeDataset.valid.TPopKontrDatum}
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <SelectField
          label="BearbeiterIn"
          fieldName="TPopKontrBearb"
          value={activeDataset.row.TPopKontrBearb}
          errorText={activeDataset.valid.TPopKontrBearb}
          dataSource={adressen}
          valueProp="AdrId"
          labelProp="AdrName"
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <Label label="Auf Plan eingezeichnet" />
        <RadioButton
          fieldName="TPopKontrPlan"
          value={activeDataset.row.TPopKontrPlan}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          label="Überprüfte Fläche in m2"
          fieldName="TPopKontrUebFlaeche"
          value={activeDataset.row.TPopKontrUebFlaeche}
          errorText={activeDataset.valid.TPopKontrUebFlaeche}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          label="Deckung überprüfte Art (%)"
          fieldName="TPopKontrUebPfl"
          value={activeDataset.row.TPopKontrUebPfl}
          errorText={activeDataset.valid.TPopKontrUebPfl}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          label="Deckung nackter Boden (%)"
          fieldName="TPopKontrNaBo"
          value={activeDataset.row.TPopKontrNaBo}
          errorText={activeDataset.valid.TPopKontrNaBo}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <Label label="Auch junge Pflanzen vorhanden" />
        <RadioButton
          fieldName="TPopKontrJungPflJN"
          value={activeDataset.row.TPopKontrJungPflJN}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          label="Maximum der Vegetationshöhe in cm"
          fieldName="TPopKontrVegHoeMax"
          value={activeDataset.row.TPopKontrVegHoeMax}
          errorText={activeDataset.valid.TPopKontrVegHoeMax}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          label="Mittelwert der Vegetationshöhe in cm"
          fieldName="TPopKontrVegHoeMit"
          value={activeDataset.row.TPopKontrVegHoeMit}
          errorText={activeDataset.valid.TPopKontrVegHoeMit}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          label="Gefährdung"
          fieldName="TPopKontrGefaehrdung"
          value={activeDataset.row.TPopKontrGefaehrdung}
          errorText={activeDataset.valid.TPopKontrGefaehrdung}
          type="text"
          multiLine
          fullWidth
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          label="Bemerkungen"
          fieldName="TPopKontrTxt"
          value={activeDataset.row.TPopKontrTxt}
          errorText={activeDataset.valid.TPopKontrTxt}
          type="text"
          multiLine
          fullWidth
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <Label label="GUID" />
        <StringToCopy text={activeDataset.row.TPopKontrGuid} />
      </FieldsContainer>
    </Container>
  )
}

Tpopfreiwkontr.propTypes = {
  store: PropTypes.object.isRequired,
  adressen: PropTypes.array.isRequired,
}

export default enhance(Tpopfreiwkontr)
