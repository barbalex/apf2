// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import TextField from '../../shared/TextField'
import TextFieldWithUrl from '../../shared/TextFieldWithUrl'
import FormTitle from '../../shared/FormTitle'
import ErrorBoundary from '../../shared/ErrorBoundary'

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

const Ber = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle tree={tree} title="Bericht" />
        <FieldsContainer>
          <TextField
            key={`${activeDataset.row.id}autor`}
            tree={tree}
            label="AutorIn"
            fieldName="autor"
            value={activeDataset.row.autor}
            errorText={activeDataset.valid.autor}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
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
          <TextField
            key={`${activeDataset.row.id}titel`}
            tree={tree}
            label="Titel"
            fieldName="titel"
            value={activeDataset.row.titel}
            errorText={activeDataset.valid.titel}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextFieldWithUrl
            key={`${activeDataset.row.id}url`}
            tree={tree}
            label="URL"
            fieldName="url"
            value={activeDataset.row.url}
            errorText={activeDataset.valid.url}
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

export default enhance(Ber)
