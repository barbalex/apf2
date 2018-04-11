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
  overflow: auto !important;
  height: 100%;
`

const enhance = compose(inject('store'), observer)

const Popber = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle tree={tree} title="Kontroll-Bericht Population" />
        <FieldsContainer>
          <TextField
            key={`${activeDataset.row.PopberId}PopBerJahr`}
            tree={tree}
            label="Jahr"
            fieldName="PopBerJahr"
            value={activeDataset.row.PopBerJahr}
            errorText={activeDataset.valid.PopBerJahr}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroup
            tree={tree}
            fieldName="PopBerEntwicklung"
            label="Entwicklung"
            value={activeDataset.row.PopBerEntwicklung}
            errorText={activeDataset.valid.PopBerEntwicklung}
            dataSource={store.dropdownList.tpopEntwicklungWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.PopberId}PopBerTxt`}
            tree={tree}
            label="Bemerkungen"
            fieldName="PopBerTxt"
            value={activeDataset.row.PopBerTxt}
            errorText={activeDataset.valid.PopBerTxt}
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

export default enhance(Popber)
