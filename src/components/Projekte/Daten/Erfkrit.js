// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const enhance = compose(inject('store'), observer)

const Erfkrit = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree
  return (
    <Container>
      <FormTitle tree={tree} title="Erfolgs-Kriterium" />
      <FieldsContainer>
        <RadioButtonGroup
          tree={tree}
          fieldName="ErfkritErreichungsgrad"
          label="Beurteilung"
          value={activeDataset.row.ErfkritErreichungsgrad}
          errorText={activeDataset.valid.ErfkritErreichungsgrad}
          dataSource={store.dropdownList.apErfkritWerte}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          key={`${activeDataset.row.ErfkritId}ErfkritTxt`}
          tree={tree}
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
    </Container>
  )
}

export default enhance(Erfkrit)
