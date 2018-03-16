// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import sortBy from 'lodash/sortBy'
import filter from 'lodash/filter'
import styled from 'styled-components'
import compose from 'recompose/compose'

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
`

const enhance = compose(inject('store'), observer)

const getArtList = ({ store, tree }: { store: Object, tree: Object }) => {
  const { adb_eigenschaften } = store.table
  // do not show any TaxonomieId's that have been used
  // turned off because some species have already been worked as separate ap
  // because beobart did not exist...
  /*
  const apArtIdsNotToShow = Array.from(store.table.beobart.values()).map(
    v => v.TaxonomieId
  )*/
  const apArtIdsNotToShow = []
  const artList = filter(
    Array.from(adb_eigenschaften.values()),
    r => !apArtIdsNotToShow.includes(r.TaxonomieId)
  )
  return sortBy(artList, 'Artname')
}

const getArtname = ({ store, tree }: { store: Object, tree: Object }) => {
  const { adb_eigenschaften } = store.table
  const { activeDataset } = tree
  let name = ''
  if (activeDataset.row.TaxonomieId && adb_eigenschaften.size > 0) {
    name = adb_eigenschaften.get(activeDataset.row.TaxonomieId).Artname
  }
  return name
}

const BeobArt = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle tree={tree} title="Art für Beobachtungen" />
        <FieldsContainer>
          <div>
            Beobachtungen dieser Art stehen im Ordner "Beobachtungen nicht
            beurteilt" zur Verfügung und können zugeordnet werden.
          </div>
          <AutoComplete
            key={`${activeDataset.row.BeobArtId}TaxonomieId`}
            tree={tree}
            label="Art"
            fieldName="TaxonomieId"
            valueText={getArtname({
              store,
              tree,
            })}
            errorText={activeDataset.valid.TaxonomieId}
            dataSource={getArtList({
              store,
              tree,
            })}
            dataSourceConfig={{
              value: 'TaxonomieId',
              text: 'Artname',
            }}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(BeobArt)
