// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'
import ErrorBoundary from '../../shared/ErrorBoundary'

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
    <ErrorBoundary>
      <Container>
        <FormTitle tree={tree} title="Ziel" />
        <FieldsContainer>
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
          <RadioButtonGroup
            tree={tree}
            fieldName="typ"
            label="Zieltyp"
            value={activeDataset.row.typ}
            errorText={activeDataset.valid.typ}
            dataSource={store.dropdownList.zielTypWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}bezeichnung`}
            tree={tree}
            label="Ziel"
            fieldName="bezeichnung"
            value={activeDataset.row.bezeichnung}
            errorText={activeDataset.valid.bezeichnung}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Ziel)
