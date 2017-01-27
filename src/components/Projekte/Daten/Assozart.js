import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import sortBy from 'lodash/sortBy'
import filter from 'lodash/filter'
import styled from 'styled-components'
import compose from 'recompose/compose'

import TextField from '../../shared/TextField'
import AutoComplete from '../../shared/Autocomplete'
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

const getArtList = ({ store }) => {
  const { activeDataset, activeUrlElements } = store
  const { adb_eigenschaften } = store.table
  const assozartenOfAp = Array.from(store.table.assozart.values()).filter(a =>
    a.AaApArtId === activeDataset.row.AaApArtId
  ).map(a => a.AaSisfNr)
  const apArtIdsNotToShow = assozartenOfAp.concat(activeUrlElements.ap)
  const artList = filter(
    Array.from(adb_eigenschaften.values()),
    r => !apArtIdsNotToShow.includes(r.TaxonomieId)
  )
  return sortBy(artList, `Artname`)
}

const getArtname = ({ store }) => {
  const { adb_eigenschaften } = store.table
  const { activeDataset } = store
  let name = ``
  if (activeDataset.row.AaSisfNr && adb_eigenschaften.size > 0) {
    name = adb_eigenschaften.get(activeDataset.row.AaSisfNr).Artname
  }
  return name
}

const Assozart = ({ store }) => {
  const { activeDataset } = store
  return (
    <Container>
      <FormTitle title="assoziierte Art" />
      <FieldsContainer>
        <AutoComplete
          label="Art"
          fieldName="AaSisfNr"
          valueText={getArtname({ store })}
          errorText={activeDataset.valid.ApArtId}
          dataSource={getArtList({ store })}
          dataSourceConfig={{
            value: `TaxonomieId`,
            text: `Artname`,
          }}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
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
    </Container>
  )
}

Assozart.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Assozart)
