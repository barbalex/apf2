// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import sortBy from 'lodash/sortBy'
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
  // do not show any art_id's that have been used
  // turned off because some species have already been worked as separate ap
  // because apart did not exist...
  /*
  const apArtIdsNotToShow = Array.from(store.table.apart.values()).map(
    v => v.art_id
  )*/
  const apArtIdsNotToShow = []
  const artList = Array.from(ae_eigenschaften.values()).filter(
    r => !apArtIdsNotToShow.includes(r.id)
  )
  return sortBy(artList, 'artname')
}

const getArtname = ({ store, tree }: { store: Object, tree: Object }) => {
  const { ae_eigenschaften } = store.table
  const { activeDataset } = tree
  let name = ''
  if (activeDataset.row.art_id && ae_eigenschaften.size > 0) {
    name = ae_eigenschaften.get(activeDataset.row.art_id).artname
  }
  return name
}

const ApArt = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle tree={tree} title="Aktionsplan-Art" />
        <FieldsContainer>
          <div>
            "Aktionsplan-Arten" sind alle Arten, welche der Aktionsplan
            behandelt. Häufig dürfte das bloss eine einzige Art sein. Folgende
            Gründe können dazu führen, dass hier mehrere aufgelistet werden:
            <ul>
              <li>Die AP-Art hat Synonyme</li>
              <li>
                Wenn eine Art im Rahmen des Aktionsplans inklusive nicht
                synonymer aber eng verwandter Arten gefasst wid (z.B.
                Unterarten)
              </li>
            </ul>
          </div>
          <div>
            Beobachtungen aller AP-Arten stehen im Ordner "Beobachtungen nicht
            beurteilt" zur Verfügung und können Teilpopulationen zugeordnet
            werden.<br />
            <br />
          </div>
          <div>
            Die im Aktionsplan gewählte namensgebende Art gibt dem Aktionsplan
            nicht nur den Namen. Unter ihrer id werden auch die Kontrollen an
            InfoFlora geliefert.<br />
            <br />
          </div>
          <AutoComplete
            key={`${activeDataset.row.id}art_id`}
            tree={tree}
            label="Art"
            fieldName="art_id"
            valueText={getArtname({
              store,
              tree,
            })}
            errorText={activeDataset.valid.art_id}
            dataSource={getArtList({
              store,
              tree,
            })}
            dataSourceConfig={{
              value: 'id',
              text: 'artname',
            }}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(ApArt)
