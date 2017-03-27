// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

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
  overflow-x: auto;
  height: 100%;
  padding-bottom: 95px;
`

const enhance = compose(
  inject(`store`),
  observer
)

const Ziel = ({ store }) => {
  const { activeDataset } = store
  return (
    <Container>
      <FormTitle title="Ziel" />
      <FieldsContainer>
        <TextField
          label="Jahr"
          fieldName="ZielJahr"
          value={activeDataset.row.ZielJahr}
          errorText={activeDataset.valid.ZielJahr}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <Label label="Zieltyp" />
        <RadioButtonGroup
          fieldName="ZielTyp"
          value={activeDataset.row.ZielTyp}
          errorText={activeDataset.valid.ZielTyp}
          dataSource={store.dropdownList.zielTypWerte}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          label="Ziel"
          fieldName="ZielBezeichnung"
          value={activeDataset.row.ZielBezeichnung}
          errorText={activeDataset.valid.ZielBezeichnung}
          type="text"
          multiLine
          fullWidth
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
      </FieldsContainer>
    </Container>
  )
}

Ziel.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Ziel)
