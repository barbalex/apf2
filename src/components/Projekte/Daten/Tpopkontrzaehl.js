// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'
import AutoComplete from '../../shared/Autocomplete'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
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
  let name = ''
  if (activeDataset.row.Zaehleinheit && zaehleinheitWerte.length > 0) {
    const zaehleinheit = zaehleinheitWerte.find(
      a => a.value === activeDataset.row.Zaehleinheit
    )
    if (zaehleinheit && zaehleinheit.label) return zaehleinheit.label
  }
  return name
}

const enhance = compose(inject('store'), observer)

const Tpopkontrzaehl = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle tree={tree} title="Zählung" />
        <FieldsContainer>
          <AutoComplete
            key={`${activeDataset.row.TPopKontrZaehlId}Zaehleinheit`}
            tree={tree}
            label="Einheit"
            fieldName="Zaehleinheit"
            valueText={getZaehleinheitName({ store, tree })}
            errorText={activeDataset.valid.Zaehleinheit}
            dataSource={store.dropdownList.zaehleinheitWerte}
            dataSourceConfig={{
              value: 'value',
              text: 'label',
            }}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.TPopKontrZaehlId}Anzahl`}
            tree={tree}
            label="Anzahl (nur ganze Zahlen)"
            fieldName="Anzahl"
            value={activeDataset.row.Anzahl}
            errorText={activeDataset.valid.Anzahl}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroup
            key={`${activeDataset.row.TPopKontrZaehlId}Methode`}
            tree={tree}
            fieldName="Methode"
            label="Methode"
            value={activeDataset.row.Methode}
            errorText={activeDataset.valid.Methode}
            dataSource={store.dropdownList.methodeWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpopkontrzaehl)
