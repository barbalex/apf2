// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import TextField from '../../../shared/TextField'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfo'
import Status from '../../../shared/Status'
import RadioButton from '../../../shared/RadioButton'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'

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
  const apTable = store.table.ap.get(activeDataset.row.id)
  const apJahr = apTable ? apTable.start_jahr : null

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
            herkunftFieldName="status"
            herkunftValue={activeDataset.row.status}
            bekanntSeitFieldName="bekannt_seit"
            bekanntSeitValue={activeDataset.row.bekannt_seit}
            bekanntSeitValid={activeDataset.valid.bekannt_seit}
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButton
            tree={tree}
            fieldName="status_unklar"
            label="Status unklar"
            value={activeDataset.row.status_unklar}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}status_unklar_begruendung`}
            tree={tree}
            label="Begründung"
            fieldName="status_unklar_begruendung"
            value={activeDataset.row.status_unklar_begruendung}
            errorText={activeDataset.valid.status_unklar_begruendung}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}x`}
            tree={tree}
            label="X-Koordinaten"
            fieldName="x"
            value={activeDataset.row.x}
            errorText={activeDataset.valid.x}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}y`}
            tree={tree}
            label="Y-Koordinaten"
            fieldName="y"
            value={activeDataset.row.y}
            errorText={activeDataset.valid.y}
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
