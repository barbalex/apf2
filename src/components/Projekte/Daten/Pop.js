// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import TextField from '../../shared/TextField'
import TextFieldWithInfo from '../../shared/TextFieldWithInfo'
import Status from '../../shared/Status'
import RadioButton from '../../shared/RadioButton'
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

const Pop = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree
  const apTable = store.table.ap.get(activeDataset.row.ApArtId)
  const apJahr = apTable ? apTable.ApJahr : null

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle tree={tree} title="Population" />
        <FieldsContainer>
          <TextField
            key={`${activeDataset.row.id}nr`}
            tree={tree}
            label="Nr."
            fieldName="nr"
            value={activeDataset.row.nr}
            errorText={activeDataset.valid.nr}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextFieldWithInfo
            key={`${activeDataset.row.id}name`}
            tree={tree}
            label="Name"
            fieldName="name"
            value={activeDataset.row.name}
            errorText={activeDataset.valid.name}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
            popover="Dieses Feld möglichst immer ausfüllen"
          />
          <Status
            tree={tree}
            apJahr={apJahr}
            herkunftFieldName="PopHerkunft"
            herkunftValue={activeDataset.row.PopHerkunft}
            bekanntSeitFieldName="PopBekanntSeit"
            bekanntSeitValue={activeDataset.row.PopBekanntSeit}
            bekanntSeitValid={activeDataset.valid.PopBekanntSeit}
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButton
            tree={tree}
            fieldName="PopHerkunftUnklar"
            label="Status unklar"
            value={activeDataset.row.PopHerkunftUnklar}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}PopHerkunftUnklarBegruendung`}
            tree={tree}
            label="Begründung"
            fieldName="PopHerkunftUnklarBegruendung"
            value={activeDataset.row.PopHerkunftUnklarBegruendung}
            errorText={activeDataset.valid.PopHerkunftUnklarBegruendung}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}PopXKoord`}
            tree={tree}
            label="X-Koordinaten"
            fieldName="PopXKoord"
            value={activeDataset.row.PopXKoord}
            errorText={activeDataset.valid.PopXKoord}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}PopYKoord`}
            tree={tree}
            label="Y-Koordinaten"
            fieldName="PopYKoord"
            value={activeDataset.row.PopYKoord}
            errorText={activeDataset.valid.PopYKoord}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Pop)
