// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import Label from '../../shared/Label'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'
import SelectField from '../../shared/SelectField'

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

const Tpopkontrzaehl = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle tree={tree} title="Zählung" />
      <FieldsContainer>
        <SelectField
          tree={tree}
          label="Einheit"
          fieldName="Zaehleinheit"
          value={activeDataset.row.Zaehleinheit}
          errorText={activeDataset.valid.Zaehleinheit}
          dataSource={store.dropdownList.zaehleinheitWerte}
          valueProp="value"
          labelProp="label"
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Anzahl"
          fieldName="Anzahl"
          value={activeDataset.row.Anzahl}
          errorText={activeDataset.valid.Anzahl}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <Label label="Methode" />
        <RadioButtonGroup
          tree={tree}
          fieldName="Methode"
          value={activeDataset.row.Methode}
          errorText={activeDataset.valid.Methode}
          dataSource={store.dropdownList.methodeWerte}
          updatePropertyInDb={store.updatePropertyInDb}
        />
      </FieldsContainer>
    </Container>
  )
}

export default enhance(Tpopkontrzaehl)
