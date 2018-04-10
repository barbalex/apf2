// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import sortBy from 'lodash/sortBy'
import filter from 'lodash/filter'
import styled from 'styled-components'
import compose from 'recompose/compose'

import TextField from '../../shared/TextField'
import AutoComplete from '../../shared/Autocomplete'
import FormTitle from '../../shared/FormTitle'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
`

const enhance = compose(inject('store'), observer)

const getArtList = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset, activeNodes } = tree
  const { adb_eigenschaften } = store.table
  const assozartenOfAp = Array.from(store.table.assozart.values())
    .filter(a => a.ap_id === activeDataset.row.ap_id)
    .map(a => a.ae_id)
  const apArtIdsNotToShow = assozartenOfAp.concat(activeNodes.ap)
  const artList = filter(
    Array.from(adb_eigenschaften.values()),
    r => !apArtIdsNotToShow.includes(r.GUID)
  )
  return sortBy(artList, 'Artname')
}

const getArtname = ({ store, tree }: { store: Object, tree: Object }) => {
  const { adb_eigenschaften } = store.table
  const { activeDataset } = tree
  let name = ''
  if (activeDataset.row.ae_id && adb_eigenschaften.size > 0) {
    name = Array.from(adb_eigenschaften.values()).find(
      v => v.GUID === activeDataset.row.ae_id
    ).Artname
  }
  return name
}

const Assozart = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle tree={tree} title="assoziierte Art" />
        <FieldsContainer>
          <AutoComplete
            key={`${activeDataset.row.id}ae_id`}
            tree={tree}
            label="Art"
            fieldName="ae_id"
            valueText={getArtname({
              store,
              tree,
            })}
            errorText={activeDataset.valid.ae_id}
            dataSource={getArtList({
              store,
              tree,
            })}
            dataSourceConfig={{
              value: 'GUID',
              text: 'Artname',
            }}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}bemerkungen`}
            tree={tree}
            label="Bemerkungen zur Assoziation"
            fieldName="bemerkungen"
            value={activeDataset.row.bemerkungen}
            errorText={activeDataset.valid.bemerkungen}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Assozart)
