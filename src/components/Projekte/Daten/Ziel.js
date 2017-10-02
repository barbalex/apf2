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
  height: 100%;
  overflow: auto !important;
`

const enhance = compose(inject('store'), observer)

const Ziel = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle tree={tree} title="Ziel" />
      <FieldsContainer>
        <TextField
          key={`${activeDataset.row.ZielId}ZielJahr`}
          tree={tree}
          label="Jahr"
          fieldName="ZielJahr"
          value={activeDataset.row.ZielJahr}
          errorText={activeDataset.valid.ZielJahr}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <RadioButtonGroup
          tree={tree}
          fieldName="ZielTyp"
          label="Zieltyp"
          value={activeDataset.row.ZielTyp}
          errorText={activeDataset.valid.ZielTyp}
          dataSource={store.dropdownList.zielTypWerte}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          key={`${activeDataset.row.ZielId}ZielBezeichnung`}
          tree={tree}
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

export default enhance(Ziel)
