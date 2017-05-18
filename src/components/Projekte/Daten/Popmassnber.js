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

const Popmassnber = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle tree={tree} title="Massnahmen-Bericht Population" />
      <FieldsContainer>
        <TextField
          tree={tree}
          label="Jahr"
          fieldName="PopMassnBerJahr"
          value={activeDataset.row.PopMassnBerJahr}
          errorText={activeDataset.valid.PopMassnBerJahr}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <RadioButtonGroup
          tree={tree}
          fieldName="PopMassnBerErfolgsbeurteilung"
          label="Entwicklung"
          value={activeDataset.row.PopMassnBerErfolgsbeurteilung}
          errorText={activeDataset.valid.PopMassnBerErfolgsbeurteilung}
          dataSource={store.dropdownList.tpopmassnErfbeurtWerte}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Interpretation"
          fieldName="PopMassnBerTxt"
          value={activeDataset.row.PopMassnBerTxt}
          errorText={activeDataset.valid.PopMassnBerTxt}
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

export default enhance(Popmassnber)
