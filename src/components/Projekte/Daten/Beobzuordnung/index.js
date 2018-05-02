// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import clone from 'lodash/clone'

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

const getTpopZuordnenSource = (
  row: Object,
  store: Object,
  tree: Object
): Array<Object> => {
  const { activeDataset } = tree
  // get all popIds of active ap
  const popList = get(
    row,
    'aeEigenschaftenByArtId.apByArtId.popsByApId.nodes',
    []
  )
  // get all tpop
  let tpopList = []
  popList.forEach(
    // clone tpop objects to make them extensible
    p => (tpopList = [...tpopList, ...get(p, 'tpopsByPopId.nodes', [])])
  )
  // with coordinates
  tpopList = tpopList.filter(t => t.x && t.y)
  tpopList = tpopList.map(o => ({
    id: o.id,
    nr: o.nr,
    popStatusWerteByStatus: o.popStatusWerteByStatus,
    x: o.x,
    y: o.y,
  }))
  console.log({ row, popList, tpopList })
  // calculate their distance to this beob
  const beob = store.table.beob.get(activeDataset.row.id)
  // beob loads later
  // prevent an error occuring if it does not yet exist
  // by passing back an empty array
  if (!beob) {
    return []
  }
  tpopList.forEach(t => {
    const dX = Math.abs(beob.x - t.x)
    const dY = Math.abs(beob.y - t.y)
    t.distance = Math.round((dX ** 2 + dY ** 2) ** 0.5)
    const pop = store.table.pop.get(t.pop_id)
    // build label
    const popStatusWerte = Array.from(store.table.pop_status_werte.values())
    let popStatusWert
    if (popStatusWerte) {
      popStatusWert = popStatusWerte.find(x => x.code === t.status)
    }
    if (popStatusWert && popStatusWert.text) {
      t.herkunft = popStatusWert.text
    } else {
      t.herkunft = 'ohne Status'
    }
    const popNr = pop.nr || pop.nr === 0 ? pop.nr : '(keine Nr)'
    const tpopNr = t.nr || t.nr === 0 ? t.nr : '(keine Nr)'
    t.label = `${t.distance.toLocaleString('de-ch')}m: ${popNr}/${tpopNr} (${
      t.herkunft
    })`
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
