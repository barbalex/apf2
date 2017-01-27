import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  overflow-x: auto;
  height: 100%;
  padding-bottom: 95px;
`

const enhance = compose(
  inject(`store`),
  observer
)

const Zielber = ({ store }) => {
  const { activeDataset } = store
  return (
    <Container>
      <FormTitle title="Ziel-Bericht" />
      <FieldsContainer>
        <TextField
          label="Jahr"
          fieldName="ZielBerJahr"
          value={activeDataset.row.ZielBerJahr}
          errorText={activeDataset.valid.ZielBerJahr}
          type="number"
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          label="Entwicklung"
          fieldName="ZielBerErreichung"
          value={activeDataset.row.ZielBerErreichung}
          errorText={activeDataset.valid.ZielBerErreichung}
          type="text"
          fullWidth
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          label="Bemerkungen"
          fieldName="ZielBerTxt"
          value={activeDataset.row.ZielBerTxt}
          errorText={activeDataset.valid.ZielBerTxt}
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

Zielber.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Zielber)
