// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Scrollbars } from 'react-custom-scrollbars'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import Label from '../../shared/Label'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'
import SelectField from '../../shared/SelectField'

const Container = styled.div`
  height: 100%;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 45px;
`

const enhance = compose(inject('store'), observer)

const Tpopkontrzaehl = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle tree={tree} title="Zählung" />
      <Scrollbars>
        <FieldsContainer>
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
      </Scrollbars>
    </Container>
  )
}

export default enhance(Tpopkontrzaehl)
