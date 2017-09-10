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

const Pop = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree
  const apTable = store.table.ap.get(activeDataset.row.ApArtId)
  const apJahr = apTable ? apTable.ApJahr : null

  return (
    <Container>
      <FormTitle tree={tree} title="Population" />
      <FieldsContainer>
        <TextField
          tree={tree}
          label="Nr."
          fieldName="PopNr"
          value={activeDataset.row.PopNr}
          errorText={activeDataset.valid.PopNr}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextFieldWithInfo
          tree={tree}
          label="Name"
          fieldName="PopName"
          value={activeDataset.row.PopName}
          errorText={activeDataset.valid.PopName}
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
  )
}

export default enhance(Pop)
