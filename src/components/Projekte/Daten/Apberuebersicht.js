// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
`

const enhance = compose(inject('store'), observer)

const Apberuebersicht = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle tree={tree} title="AP-Bericht Jahresübersicht" />
      <FieldsContainer>
        <TextField
          key={`${activeDataset.row.ProjId}${activeDataset.row.id}JbuJahr`}
          tree={tree}
          label="Jahr"
          fieldName="JbuJahr"
          value={activeDataset.row.JbuJahr}
          errorText={activeDataset.valid.JbuJahr}
          type="number"
          fullWidth={false}
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          key={`${activeDataset.row.ProjId}${
            activeDataset.row.id
          }JbuBemerkungen`}
          tree={tree}
          label="Bemerkungen"
          fieldName="JbuBemerkungen"
          value={activeDataset.row.JbuBemerkungen}
          errorText={activeDataset.valid.JbuBemerkungen}
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

export default enhance(Apberuebersicht)
