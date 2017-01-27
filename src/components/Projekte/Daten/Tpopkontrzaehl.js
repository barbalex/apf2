import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import Label from '../../shared/Label'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'
import SelectField from '../../shared/SelectField'

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
    let zaehleinheitWerte = Array.from(
      store.table.tpopkontrzaehl_einheit_werte.values()
    )
    zaehleinheitWerte = sortBy(zaehleinheitWerte, `ZaehleinheitOrd`)
    zaehleinheitWerte = zaehleinheitWerte.map(el => ({
      value: el.ZaehleinheitCode,
      label: el.ZaehleinheitTxt,
    }))
    zaehleinheitWerte.unshift({
      value: null,
      label: ``,
    })
    let methodeWerte = Array.from(
      store.table.tpopkontrzaehl_methode_werte.values()
    )
    methodeWerte = sortBy(methodeWerte, `BeurteilOrd`)
    methodeWerte = methodeWerte.map(el => ({
      value: el.BeurteilCode,
      label: el.BeurteilTxt,
    }))
    return {
      zaehleinheitWerte,
      methodeWerte,
    }
  }),
  observer
)

const Tpopkontrzaehl = ({
  store,
  zaehleinheitWerte,
  methodeWerte,
}) => {
  const { activeDataset } = store
  return (
    <Container>
      <FormTitle title="Zählung" />
      <FieldsContainer>
        <TextField
          label="Anzahl"
          fieldName="Anzahl"
          value={activeDataset.row.Anzahl}
          errorText={activeDataset.valid.Anzahl}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <SelectField
          label="Einheit"
          fieldName="Zaehleinheit"
          value={activeDataset.row.Zaehleinheit}
          errorText={activeDataset.valid.Zaehleinheit}
          dataSource={zaehleinheitWerte}
          valueProp="value"
          labelProp="label"
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <Label label="Methode" />
        <RadioButtonGroup
          fieldName="Methode"
          value={activeDataset.row.Methode}
          errorText={activeDataset.valid.Methode}
          dataSource={methodeWerte}
          updatePropertyInDb={store.updatePropertyInDb}
        />
      </FieldsContainer>
    </Container>
  )
}

Tpopkontrzaehl.propTypes = {
  store: PropTypes.object.isRequired,
  zaehleinheitWerte: PropTypes.array.isRequired,
  methodeWerte: PropTypes.array.isRequired,
}

export default enhance(Tpopkontrzaehl)
