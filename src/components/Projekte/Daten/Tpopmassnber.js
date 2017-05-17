// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import Label from '../../shared/Label'
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

const Tpopmassnber = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle tree={tree} title="Massnahmen-Bericht Teil-Population" />
      <FieldsContainer>
        <TextField
          tree={tree}
          label="Jahr"
          fieldName="TPopMassnBerJahr"
          value={activeDataset.row.TPopMassnBerJahr}
          errorText={activeDataset.valid.TPopMassnBerJahr}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <Label label="Entwicklung" />
        <RadioButtonGroup
          tree={tree}
          fieldName="TPopMassnBerErfolgsbeurteilung"
          value={activeDataset.row.TPopMassnBerErfolgsbeurteilung}
          errorText={activeDataset.valid.TPopMassnBerErfolgsbeurteilung}
          dataSource={store.dropdownList.tpopmassnErfbeurtWerte}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Interpretation"
          fieldName="TPopMassnBerTxt"
          value={activeDataset.row.TPopMassnBerTxt}
          errorText={activeDataset.valid.TPopMassnBerTxt}
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

export default enhance(Tpopmassnber)
