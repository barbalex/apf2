// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import chain from 'lodash/chain'
import flatten from 'lodash/flatten'

import FormTitle from '../../../shared/FormTitle'
import TextField from '../../../shared/TextFieldGql'
import CheckboxWithInfo from '../../../shared/CheckboxWithInfo'
import AutoComplete from '../../../shared/AutocompleteGql'
import Beob from '../Beob'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import beobByIdGql from './beobById.graphql'
import updateBeobByIdGql from './updateBeobById.graphql'

const Container = styled.div`
  height: 100%;
  overflow-x: auto;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`
const FormContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const DataContainer = styled.div`
  height: 100%;
  overflow: auto !important;
`
const FieldsContainer = styled.div`
  padding: 10px;
`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: #b3b3b3;
  font-weight: bold;
  background-color: #424242;
  margin-top: 10px;
  padding-bottom: 10px;
`
const ZuordnenDiv = styled.div`
  margin-bottom: -10px;
`
const LabelPopoverRow = styled.div`
  padding: 2px 5px 2px 5px;
`
const LabelPopoverTitleRow = styled(LabelPopoverRow)`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #565656;
  color: white;
`
const LabelPopoverContentRow = styled(LabelPopoverRow)`
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  border-top-style: none;
  &:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
`
const nichtZuordnenPopover = (
  <Container>
    <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
    <LabelPopoverContentRow>
      {'Will heissen: Die Beobachtung kann nicht zugeordnet werden.'}
      <br />
      {'Mögliche Gründe: Unsichere Bestimmung, nicht lokalisierbar.'}
      <br />
      {'Bitte im Bemerkungsfeld begründen.'}
    </LabelPopoverContentRow>
  </Container>
)

const getTpopZuordnenSource = (row: Object): Array<Object> => {
  // get all popIds of active ap
  const popList = get(
    row,
    'aeEigenschaftenByArtId.apByArtId.popsByApId.nodes',
    []
  )
  // get all tpop
  let tpopList = flatten(popList.map(p => get(p, 'tpopsByPopId.nodes', [])))
    // with coordinates
    .filter(t => !!t.x && !!t.y)
    .map(t => {
      // calculate their distance to this beob
      const dX = Math.abs(row.x - t.x)
      const dY = Math.abs(row.y - t.y)
      const distance = Math.round((dX ** 2 + dY ** 2) ** 0.5).toLocaleString(
        'de-ch'
      )
      // build label
      const tpopStatus = get(t, 'popStatusWerteByStatus.text', 'ohne Status')
      const popNr = get(t, 'popByPopId.nr', '(keine Nr)')
      const tpopNr = t.nr || '(keine Nr)'

      return {
        id: t.id,
        distance,
        label: `${distance}m: ${popNr}/${tpopNr} (${tpopStatus})`,
      }
    })
  // order them by distance
  tpopList = sortBy(tpopList, 'distance')
  // return array of id, label
  return tpopList.map(t => ({
    id: t.id,
    value: t.label,
  }))
}

const enhance = compose(
  inject('store'),
  withHandlers({
    updatePropertyInDb: ({ store, tree }) => (
      treePassedByUpdatePropertyInDb,
      fieldname,
      val
    ) => {
      const {
        insertBeobzuordnung,
        updatePropertyInDb,
        deleteBeobzuordnung,
      } = store
      const { activeDataset } = tree
      if (val) {
        if (activeDataset.table === 'beob') {
          insertBeobzuordnung(tree, activeDataset.row, fieldname, val)
        } else {
          // beob was moved from one tpop-id to another
          updatePropertyInDb(tree, fieldname, val)
        }
      } else {
        deleteBeobzuordnung(tree, activeDataset.row.id)
      }
    },
  }),
  observer
)

const Beobzuordnung = ({
  id,
  store,
  tree,
  updatePropertyInDb,
  dimensions = { width: 380 },
}: {
  id: String,
  store: Object,
  tree: Object,
  updatePropertyInDb: () => void,
  dimensions: Object,
}) => {
  const { table } = store
  const { activeDataset } = tree
  const beob = activeDataset.row
  const quelle = beob ? table.beob_quelle_werte.get(beob.quelle_id) : null
  const quelleName = quelle && quelle.name ? quelle.name : '?'
  const beobTitle = `Informationen aus ${quelleName} (nicht veränderbar)`
  const showTPopId = activeDataset.row.nicht_zuordnen !== 1
  const adbArt =
    beob && beob.art_id ? store.table.ae_eigenschaften.get(beob.art_id) : null
  const artname = adbArt ? adbArt.artname : ''
  const artLabel = `Beobachtete Art: ${artname}`

  return (
    <Query query={beobByIdGql} variables={{ id }}>
      {({ loading, error, data }) => {
        if (loading)
          return (
            <Container>
              <FieldsContainer>Lade...</FieldsContainer>
            </Container>
          )
        if (error) return `Fehler: ${error.message}`

        const row = get(data, 'beobById')
        const tpopZuordnenSource = getTpopZuordnenSource(row, store, tree)
        const tpopZuordnenObject = tpopZuordnenSource.find(
          o => o.id === activeDataset.row.tpop_id
        )
        const tpopZuordnenValue =
          tpopZuordnenObject && tpopZuordnenObject.value
            ? tpopZuordnenObject.value
            : null

        return (
          <ErrorBoundary>
            <FormContainer>
              <FormTitle
                apId={get(row, 'aeEigenschaftenByArtId.apByArtId.id', null)}
                title="Beobachtung"
              />
              <DataContainer>
                <Mutation mutation={updateBeobByIdGql}>
                  {(updateBeob, { data }) => (
                    <FieldsContainer>
                      <div>{artLabel}</div>
                      <CheckboxWithInfo
                        key={`${activeDataset.row.id}nichtZuordnen`}
                        label="Nicht zuordnen"
                        value={activeDataset.row.nichtZuordnen}
                        saveToDb={value =>
                          updateBeob({
                            variables: {
                              id,
                              nichtZuordnen: value,
                            },
                          })
                        }
                        popover={nichtZuordnenPopover}
                      />
                      {showTPopId && (
                        <ZuordnenDiv>
                          <AutoComplete
                            key={`${activeDataset.row.id}tpopId`}
                            label="Einer Teilpopulation zuordnen"
                            value={tpopZuordnenValue}
                            objects={tpopZuordnenSource}
                            saveToDb={value =>
                              updateBeob({
                                variables: {
                                  id,
                                  tpopId: value,
                                },
                              })
                            }
                          />
                        </ZuordnenDiv>
                      )}
                      <TextField
                        key={`${activeDataset.row.id}bemerkungen`}
                        tree={tree}
                        label="Bemerkungen zur Zuordnung"
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
                  )}
                </Mutation>
                <Title>{beobTitle}</Title>
                <Beob id={activeDataset.row.id} dimensions={dimensions} />
              </DataContainer>
            </FormContainer>
          </ErrorBoundary>
        )
      }}
    </Query>
  )
}

export default enhance(Beobzuordnung)
