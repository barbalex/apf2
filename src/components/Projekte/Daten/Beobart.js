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
  const { ae_eigenschaften } = store.table
  // do not show any taxid's that have been used
  // turned off because some species have already been worked as separate ap
  // because beobart did not exist...
  /*
  const apArtIdsNotToShow = Array.from(store.table.beobart.values()).map(
    v => v.taxid
  )*/
  const apArtIdsNotToShow = []
  const artList = filter(
    Array.from(ae_eigenschaften.values()),
    r => !apArtIdsNotToShow.includes(r.taxid)
  )
  return sortBy(artList, 'artname')
}

const getArtname = ({ store, tree }: { store: Object, tree: Object }) => {
  const { ae_eigenschaften } = store.table
  const { activeDataset } = tree
  let name = ''
  if (activeDataset.row.taxid && ae_eigenschaften.size > 0) {
    name = ae_eigenschaften.get(activeDataset.row.taxid).artname
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
            key={`${activeDataset.row.id}taxid`}
            tree={tree}
            label="Art"
            fieldName="taxid"
            valueText={getArtname({
              store,
              tree,
            })}
            errorText={activeDataset.valid.taxid}
            dataSource={getArtList({
              store,
              tree,
            })}
            dataSourceConfig={{
              value: 'taxid',
              text: 'artname',
            }}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(BeobArt)
