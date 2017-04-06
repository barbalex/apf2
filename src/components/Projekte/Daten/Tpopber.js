// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Scrollbars } from 'react-custom-scrollbars'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import Label from '../../shared/Label'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 45px;
`

const enhance = compose(
  inject(`store`),
  observer
)

const Tpopber = ({ store, tree }) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle title="Kontroll-Bericht Teil-Population" />
      <Scrollbars>
        <FieldsContainer>
          <TextField
            label="Jahr"
            fieldName="TPopBerJahr"
            value={activeDataset.row.TPopBerJahr}
            errorText={activeDataset.valid.TPopBerJahr}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <Label label="Entwicklung" />
          <RadioButtonGroup
            fieldName="TPopBerEntwicklung"
            value={activeDataset.row.TPopBerEntwicklung}
            errorText={activeDataset.valid.TPopBerEntwicklung}
            dataSource={store.dropdownList.tpopEntwicklungWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            label="Bemerkungen"
            fieldName="TPopBerTxt"
            value={activeDataset.row.TPopBerTxt}
            errorText={activeDataset.valid.TPopBerTxt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Scrollbars>
    </Container>
  )
}

Tpopber.propTypes = {
  store: PropTypes.object.isRequired,
  tree: PropTypes.object.isRequired,
}

export default enhance(Tpopber)
