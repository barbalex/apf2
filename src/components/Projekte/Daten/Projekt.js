// @flow
import React from 'react'
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

const Projekt = (
  {
    store,
    tree,
  }:
  {
    store: Object,
    tree: Object,
  }
) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle tree={tree} title="Projekt" />
      <Scrollbars>
        <FieldsContainer>
          <TextField
            tree={tree}
            label="Name"
            fieldName="ProjName"
            value={
              (activeDataset && activeDataset.row && activeDataset.row.ProjName) ?
              activeDataset.row.ProjName :
              ``
            }
            errorText={
              (activeDataset && activeDataset.valid && activeDataset.valid.ProjName) ?
              activeDataset.valid.ProjName :
              ``
            }
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Scrollbars>
    </Container>
  )
}

export default enhance(Projekt)
