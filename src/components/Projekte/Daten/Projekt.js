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
  padding: 10px;
  overflow: auto !important;
`

const enhance = compose(inject('store'), observer)

const Projekt = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle tree={tree} title="Projekt" />
      <FieldsContainer>
        <TextField
          key={`${activeDataset.row.ProjId}ProjName`}
          tree={tree}
          label="Name"
          fieldName="ProjName"
          value={
            activeDataset && activeDataset.row && activeDataset.row.ProjName ? (
              activeDataset.row.ProjName
            ) : (
              ''
            )
          }
          errorText={
            activeDataset &&
            activeDataset.valid &&
            activeDataset.valid.ProjName ? (
              activeDataset.valid.ProjName
            ) : (
              ''
            )
          }
          type="text"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
      </FieldsContainer>
    </Container>
  )
}

export default enhance(Projekt)
