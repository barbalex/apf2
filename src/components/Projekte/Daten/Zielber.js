// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Scrollbars } from 'react-custom-scrollbars'

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

const Zielber = ({ store, tree }) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle title="Ziel-Bericht" />
      <Scrollbars>
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
      </Scrollbars>
    </Container>
  )
}

Zielber.propTypes = {
  store: PropTypes.object.isRequired,
  tree: PropTypes.object.isRequired,
}

export default enhance(Zielber)
