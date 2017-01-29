// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { Scrollbars } from 'react-custom-scrollbars'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import Label from '../../shared/Label'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 45px;
`

const enhance = compose(
  inject(`store`),
  withProps((props) => {
    let apErfkritWerte = Array.from(
      props.store.table.ap_erfkrit_werte.values()
    )
    apErfkritWerte = sortBy(apErfkritWerte, `BeurteilOrd`)
    apErfkritWerte = apErfkritWerte.map(el => ({
      value: el.BeurteilId,
      label: el.BeurteilTxt,
    }))
    return { apErfkritWerte }
  }),
  observer
)

const Erfkrit = ({
  store,
  apErfkritWerte,
}) => {
  const { activeDataset } = store
  return (
    <Container>
      <FormTitle title="Erfolgs-Kriterium" />
      <Scrollbars>
        <FieldsContainer>
          <Label label="Beurteilung" />
          <RadioButtonGroup
            fieldName="ErfkritErreichungsgrad"
            value={activeDataset.row.ErfkritErreichungsgrad}
            errorText={activeDataset.valid.ErfkritErreichungsgrad}
            dataSource={apErfkritWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            label="Kriterien"
            fieldName="ErfkritTxt"
            value={activeDataset.row.ErfkritTxt}
            errorText={activeDataset.valid.ErfkritTxt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Scrollbars>
    </Container>
  )
}

Erfkrit.propTypes = {
  store: PropTypes.object.isRequired,
  apErfkritWerte: PropTypes.array.isRequired,
}

export default enhance(Erfkrit)
