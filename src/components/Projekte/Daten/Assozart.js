// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import sortBy from 'lodash/sortBy'
import filter from 'lodash/filter'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Scrollbars } from 'react-custom-scrollbars'

import TextField from '../../shared/TextField'
import AutoComplete from '../../shared/Autocomplete'
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

const getArtList = ({ store, tree }) => {
  const { activeDataset, activeNodes } = tree
  const { adb_eigenschaften } = store.table
  const assozartenOfAp = Array.from(store.table.assozart.values()).filter(a =>
    a.AaApArtId === activeDataset.row.AaApArtId
  ).map(a => a.AaSisfNr)
  const apArtIdsNotToShow = assozartenOfAp.concat(activeNodes.ap)
  const artList = filter(
    Array.from(adb_eigenschaften.values()),
    r => !apArtIdsNotToShow.includes(r.TaxonomieId)
  )
  return sortBy(artList, `Artname`)
}

const getArtname = ({ store, tree }) => {
  const { adb_eigenschaften } = store.table
  const { activeDataset } = tree
  let name = ``
  if (activeDataset.row.AaSisfNr && adb_eigenschaften.size > 0) {
    name = adb_eigenschaften.get(activeDataset.row.AaSisfNr).Artname
  }
  return name
}

const Assozart = (
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
      <FormTitle tree={tree} title="assoziierte Art" />
      <Scrollbars>
        <FieldsContainer>
          <AutoComplete
            tree={tree}
            label="Art"
            fieldName="AaSisfNr"
            valueText={getArtname({ store, tree })}
            errorText={activeDataset.valid.ApArtId}
            dataSource={getArtList({ store, tree })}
            dataSourceConfig={{
              value: `TaxonomieId`,
              text: `Artname`,
            }}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Bemerkungen zur Assoziation"
            fieldName="AaBem"
            value={activeDataset.row.AaBem}
            errorText={activeDataset.valid.AaBem}
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

export default enhance(Assozart)
