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

const Popber = ({ store }) => {
  const { activeDataset } = store.tree

  return (
    <Container>
      <FormTitle title="Kontroll-Bericht Population" />
      <Scrollbars>
        <FieldsContainer>
          <TextField
            label="Jahr"
            fieldName="PopBerJahr"
            value={activeDataset.row.PopBerJahr}
            errorText={activeDataset.valid.PopBerJahr}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <Label label="Entwicklung" />
          <RadioButtonGroup
            fieldName="PopBerEntwicklung"
            value={activeDataset.row.PopBerEntwicklung}
            errorText={activeDataset.valid.PopBerEntwicklung}
            dataSource={store.dropdownList.popEntwicklungWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
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
      </Scrollbars>
    </Container>
  )
}

Popber.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Popber)
