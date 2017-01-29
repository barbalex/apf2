import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import sortBy from 'lodash/sortBy'
import { Scrollbars } from 'react-custom-scrollbars'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import Label from '../../shared/Label'
import TextField from '../../shared/TextField'
import DatePicker from '../../shared/DatePicker'
import SelectField from '../../shared/SelectField'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 45px;
`

const getApErfkritWerte = ({ store }) => {
  let apErfkritWerte = Array.from(
    store.table.ap_erfkrit_werte.values()
  )
  apErfkritWerte = sortBy(apErfkritWerte, `BeurteilOrd`)
  return apErfkritWerte.map(el => ({
    value: el.BeurteilId,
    label: el.BeurteilTxt,
  }))
}

const getAdressen = ({ store }) => {
  const adressen = sortBy(
    Array.from(store.table.adresse.values()),
    `AdrName`
  )
  adressen.unshift({
    id: null,
    AdrName: ``,
  })
  return adressen
}

const enhance = compose(
  inject(`store`),
  observer
)

const Apber = ({ store }) => {
  const { activeDataset } = store
  const veraenGegenVorjahrWerte = [
    { value: `+`, label: `+` },
    { value: `-`, label: `-` },
  ]

  return (
    <Container>
      <FormTitle title="AP-Bericht" />
      <Scrollbars>
        <FieldsContainer>
          <TextField
            label="Jahr"
            fieldName="JBerJahr"
            value={activeDataset.row.JBerJahr}
            errorText={activeDataset.valid.JBerJahr}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <Label label="Beurteilung" />
          <RadioButtonGroup
            fieldName="JBerBeurteilung"
            value={activeDataset.row.JBerBeurteilung}
            errorText={activeDataset.valid.JBerBeurteilung}
            dataSource={getApErfkritWerte({ store })}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <Label label="Veränderung zum Vorjahr" />
          <RadioButtonGroup
            fieldName="JBerVeraenGegenVorjahr"
            value={activeDataset.row.JBerVeraenGegenVorjahr}
            errorText={activeDataset.valid.JBerVeraenGegenVorjahr}
            dataSource={veraenGegenVorjahrWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
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
          <DatePicker
            label="Datum"
            fieldName="JBerDatum"
            value={activeDataset.row.JBerDatum}
            errorText={activeDataset.valid.JBerDatum}
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <SelectField
            label="BearbeiterIn"
            fieldName="JBerBearb"
            value={activeDataset.row.JBerBearb}
            errorText={activeDataset.valid.JBerBearb}
            dataSource={getAdressen({ store })}
            valueProp="AdrId"
            labelProp="AdrName"
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Scrollbars>
    </Container>
  )
}

Apber.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Apber)
