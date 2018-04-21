// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'
import AutoCompleteNew from '../../shared/AutocompleteNew'
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

const getZaehleinheitName = ({
  store,
  tree,
}: {
  store: Object,
  tree: Object,
}) => {
  const { zaehleinheitWerte } = store.dropdownList
  const { activeDataset } = tree
  let value = ''
  if (activeDataset.row.einheit && zaehleinheitWerte.length > 0) {
    const zaehleinheit = zaehleinheitWerte.find(
      a => a.id === activeDataset.row.einheit
    )
    if (zaehleinheit && zaehleinheit.value) return zaehleinheit.value
  }
  return value
}

const enhance = compose(inject('store'), observer)

const Tpopkontrzaehl = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle tree={tree} title="Zählung" />
        <FieldsContainer>
          <AutoCompleteNew
            key={`${activeDataset.row.id}einheitNew`}
            tree={tree}
            label="Einheit"
            fieldName="einheit"
            value={getZaehleinheitName({ store, tree })}
            objects={store.dropdownList.zaehleinheitWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}anzahl`}
            tree={tree}
            label="Anzahl (nur ganze Zahlen)"
            fieldName="anzahl"
            value={activeDataset.row.anzahl}
            errorText={activeDataset.valid.anzahl}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroup
            key={`${activeDataset.row.id}methode`}
            tree={tree}
            fieldName="methode"
            label="Methode"
            value={activeDataset.row.methode}
            errorText={activeDataset.valid.methode}
            dataSource={store.dropdownList.methodeWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpopkontrzaehl)
