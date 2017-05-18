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
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  overflow: auto !important;
`

const enhance = compose(inject('store'), observer)

const Tpopber = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle tree={tree} title="Kontroll-Bericht Teil-Population" />
      <FieldsContainer>
        <TextField
          tree={tree}
          label="Jahr"
          fieldName="TPopBerJahr"
          value={activeDataset.row.TPopBerJahr}
          errorText={activeDataset.valid.TPopBerJahr}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <RadioButtonGroup
          tree={tree}
          fieldName="TPopBerEntwicklung"
          label="Entwicklung"
          value={activeDataset.row.TPopBerEntwicklung}
          errorText={activeDataset.valid.TPopBerEntwicklung}
          dataSource={store.dropdownList.tpopEntwicklungWerte}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Bemerkungen"
          fieldName="TPopBerTxt"
          value={activeDataset.row.TPopBerTxt}
          errorText={activeDataset.valid.TPopBerTxt}
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

export default enhance(Tpopber)
